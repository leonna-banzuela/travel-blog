import { createHash, randomBytes, randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  access,
  copyFile,
  mkdir,
  open,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import * as z from "zod";

import {
  createTravelCatalog,
  formatCatalogIssues,
} from "../../src/content/catalog";
import { controlledTagValues } from "../../src/content/tags";
import {
  buildStudioCatalog,
  isAllowedStudioHost,
  parseStudioInput,
  slugifyStudioValue,
  sniffUploadType,
} from "./core";

const STUDIO_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(STUDIO_DIR, "../..");
const CATALOG_PATH = join(ROOT_DIR, "content/data/catalog.json");
const UPLOAD_DIR = join(ROOT_DIR, "content/studio/uploads");
const PUBLIC_MEDIA_DIR = join(ROOT_DIR, "public/media");
const STATE_DIR = join(STUDIO_DIR, ".studio-state");
const AUTOSAVE_PATH = join(STATE_DIR, "autosave.json");
const BACKUP_PATH = join(STATE_DIR, "catalog-backup.json");
const HOST = "127.0.0.1";
const PORT = Number.parseInt(process.env.STUDIO_PORT ?? "4178", 10);
const ORIGIN = `http://${HOST}:${PORT}`;
const STUDIO_TOKEN = randomBytes(32).toString("hex");
const MAX_JSON_BYTES = 1_000_000;
const MAX_UPLOAD_BYTES = 250_000_000;

if (!Number.isInteger(PORT) || PORT < 1024 || PORT > 65_535) {
  throw new Error("STUDIO_PORT must be an integer between 1024 and 65535.");
}

const staticFiles = new Map([
  ["/studio.css", { file: "studio.css", type: "text/css; charset=utf-8" }],
  ["/studio.js", { file: "studio.js", type: "text/javascript; charset=utf-8" }],
]);

const mediaTypes = new Map([
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".heic", "image/heic"],
  [".mp4", "video/mp4"],
  [".mov", "video/quicktime"],
  [".webm", "video/webm"],
]);

function applySecurityHeaders(response: ServerResponse): void {
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  );
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Cache-Control", "no-store");
}

function sendJson(
  response: ServerResponse,
  status: number,
  body: unknown,
): void {
  applySecurityHeaders(response);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(`${JSON.stringify(body)}\n`);
}

function sendText(
  response: ServerResponse,
  status: number,
  body: string,
  contentType = "text/plain; charset=utf-8",
): void {
  applySecurityHeaders(response);
  response.writeHead(status, { "Content-Type": contentType });
  response.end(body);
}

function requireLocalHost(request: IncomingMessage): void {
  if (!isAllowedStudioHost(request.headers.host, PORT)) {
    throw Object.assign(
      new Error("The studio only accepts local Host headers."),
      { status: 403 },
    );
  }
}

function requireStudioToken(
  request: IncomingMessage,
  checkOrigin = false,
): void {
  requireLocalHost(request);
  const cookieToken = request.headers.cookie
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith("studio_session="))
    ?.slice("studio_session=".length);
  if (
    request.headers["x-studio-token"] !== STUDIO_TOKEN &&
    cookieToken !== STUDIO_TOKEN
  ) {
    throw Object.assign(
      new Error("The studio session token is missing or invalid."),
      { status: 403 },
    );
  }
  if (checkOrigin && request.headers.origin !== ORIGIN) {
    throw Object.assign(
      new Error("The request origin is not the local studio."),
      { status: 403 },
    );
  }
}

async function readBody(
  request: IncomingMessage,
  limit: number,
): Promise<Buffer> {
  const declared = Number(request.headers["content-length"] ?? 0);
  if (declared > limit) {
    throw Object.assign(new Error(`Request exceeds the ${limit} byte limit.`), {
      status: 413,
    });
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += bytes.length;
    if (size > limit) {
      throw Object.assign(
        new Error(`Request exceeds the ${limit} byte limit.`),
        { status: 413 },
      );
    }
    chunks.push(bytes);
  }
  return Buffer.concat(chunks);
}

async function readJson(
  request: IncomingMessage,
  limit = MAX_JSON_BYTES,
): Promise<unknown> {
  const body = await readBody(request, limit);
  try {
    return JSON.parse(body.toString("utf8"));
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON."), {
      status: 400,
    });
  }
}

async function readCatalog() {
  const content = await readFile(CATALOG_PATH, "utf8");
  return createTravelCatalog(JSON.parse(content));
}

async function writeCatalog(
  catalog: ReturnType<typeof createTravelCatalog>,
): Promise<void> {
  await mkdir(STATE_DIR, { recursive: true });
  await copyFile(CATALOG_PATH, BACKUP_PATH);
  const temporaryPath = `${CATALOG_PATH}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(catalog, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });
  try {
    await rename(temporaryPath, CATALOG_PATH);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }
}

function findImageDimensions(
  mimeType: string,
  head: Buffer,
): { width: number; height: number } | null {
  if (mimeType === "image/png" && head.length >= 24) {
    return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
  }
  if (mimeType === "image/jpeg") {
    let offset = 2;
    while (offset + 9 < head.length) {
      if (head[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = head[offset + 1];
      const segmentLength = head.readUInt16BE(offset + 2);
      if (
        [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb].includes(
          marker,
        )
      ) {
        return {
          width: head.readUInt16BE(offset + 7),
          height: head.readUInt16BE(offset + 5),
        };
      }
      if (segmentLength < 2) break;
      offset += segmentLength + 2;
    }
  }
  return null;
}

async function handleUpload(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  requireStudioToken(request, true);
  const encodedName = String(request.headers["x-file-name"] ?? "");
  let originalName: string;
  try {
    originalName = decodeURIComponent(encodedName);
  } catch {
    throw Object.assign(new Error("The upload filename is invalid."), {
      status: 400,
    });
  }
  if (
    !originalName ||
    originalName.length > 240 ||
    /[\\/\0]/.test(originalName)
  ) {
    throw Object.assign(new Error("The upload filename is unsafe."), {
      status: 400,
    });
  }

  const declared = Number(request.headers["content-length"] ?? 0);
  if (
    !Number.isFinite(declared) ||
    declared <= 0 ||
    declared > MAX_UPLOAD_BYTES
  ) {
    throw Object.assign(
      new Error("Upload size is missing or exceeds 250 MB."),
      { status: 413 },
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const temporaryPath = join(UPLOAD_DIR, `.upload-${randomUUID()}.tmp`);
  const handle = await open(temporaryPath, "wx");
  const hash = createHash("sha256");
  const headChunks: Buffer[] = [];
  let headSize = 0;
  let total = 0;
  try {
    for await (const chunk of request) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += bytes.length;
      if (total > MAX_UPLOAD_BYTES) {
        throw Object.assign(new Error("Upload exceeds 250 MB."), {
          status: 413,
        });
      }
      hash.update(bytes);
      if (headSize < 65_536) {
        const part = bytes.subarray(0, 65_536 - headSize);
        headChunks.push(part);
        headSize += part.length;
      }
      await handle.write(bytes);
    }
  } catch (error) {
    await handle.close();
    await rm(temporaryPath, { force: true });
    throw error;
  }
  await handle.close();

  const head = Buffer.concat(headChunks);
  const detected = sniffUploadType(head);
  if (!detected) {
    await rm(temporaryPath, { force: true });
    throw Object.assign(
      new Error(
        "Unsupported file content. Use JPEG, PNG, WebP, AVIF, HEIC, MP4, MOV, or WebM.",
      ),
      { status: 415 },
    );
  }
  if (total > detected.maxBytes) {
    await rm(temporaryPath, { force: true });
    throw Object.assign(
      new Error(
        `${detected.kind === "image" ? "Images" : "Videos"} exceed the allowed size.`,
      ),
      { status: 413 },
    );
  }

  const digest = hash.digest("hex");
  const base = slugifyStudioValue(originalName.replace(/\.[^.]+$/, "")).slice(
    0,
    50,
  );
  const stagedName = `${base}-${digest.slice(0, 12)}${detected.extension}`;
  const destination = join(UPLOAD_DIR, stagedName);
  try {
    await access(destination);
    await rm(temporaryPath, { force: true });
  } catch {
    await rename(temporaryPath, destination);
  }

  const dimensions = findImageDimensions(detected.mimeType, head);
  sendJson(response, 201, {
    upload: {
      id: `media-${digest.slice(0, 12)}`,
      stagedName,
      kind: detected.kind,
      mimeType: detected.mimeType,
      size: total,
      width: dimensions?.width,
      height: dimensions?.height,
      previewUrl: `/studio-media/${encodeURIComponent(stagedName)}`,
    },
  });
}

async function serveLocalMedia(
  pathname: string,
  routePrefix: string,
  directory: string,
  response: ServerResponse,
): Promise<void> {
  const encoded = pathname.slice(routePrefix.length);
  let filename: string;
  try {
    filename = decodeURIComponent(encoded);
  } catch {
    sendText(response, 400, "Invalid media path.");
    return;
  }
  if (!/^[a-z0-9][a-z0-9._-]{2,119}$/i.test(filename)) {
    sendText(response, 400, "Invalid media path.");
    return;
  }
  const filePath = join(directory, filename);
  const contentType = mediaTypes.get(extname(filename).toLowerCase());
  if (!contentType) {
    sendText(response, 415, "Unsupported media type.");
    return;
  }
  try {
    await access(filePath);
  } catch {
    sendText(response, 404, "Media not found.");
    return;
  }
  applySecurityHeaders(response);
  response.writeHead(200, {
    "Content-Type": contentType,
    "Content-Disposition": "inline",
  });
  createReadStream(filePath).pipe(response);
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  requireLocalHost(request);
  const url = new URL(request.url ?? "/", ORIGIN);

  if (request.method === "GET" && url.pathname === "/") {
    const template = await readFile(join(STUDIO_DIR, "index.html"), "utf8");
    response.setHeader(
      "Set-Cookie",
      `studio_session=${STUDIO_TOKEN}; HttpOnly; SameSite=Strict; Path=/`,
    );
    sendText(
      response,
      200,
      template.replaceAll("__STUDIO_TOKEN__", STUDIO_TOKEN),
      "text/html; charset=utf-8",
    );
    return;
  }

  const staticFile = staticFiles.get(url.pathname);
  if (request.method === "GET" && staticFile) {
    sendText(
      response,
      200,
      await readFile(join(STUDIO_DIR, staticFile.file), "utf8"),
      staticFile.type,
    );
    return;
  }

  if (request.method === "GET" && url.pathname.startsWith("/studio-media/")) {
    requireStudioToken(request);
    await serveLocalMedia(url.pathname, "/studio-media/", UPLOAD_DIR, response);
    return;
  }

  if (request.method === "GET" && url.pathname.startsWith("/public-media/")) {
    requireStudioToken(request);
    await serveLocalMedia(
      url.pathname,
      "/public-media/",
      PUBLIC_MEDIA_DIR,
      response,
    );
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/catalog") {
    requireStudioToken(request);
    sendJson(response, 200, {
      catalog: await readCatalog(),
      tagValues: controlledTagValues,
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/recovery") {
    requireStudioToken(request);
    try {
      sendJson(response, 200, {
        recovery: JSON.parse(await readFile(AUTOSAVE_PATH, "utf8")),
      });
    } catch {
      sendJson(response, 200, { recovery: null });
    }
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/upload") {
    await handleUpload(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/autosave") {
    requireStudioToken(request, true);
    const snapshot = await readJson(request);
    await mkdir(STATE_DIR, { recursive: true });
    await writeFile(
      AUTOSAVE_PATH,
      `${JSON.stringify(snapshot, null, 2)}\n`,
      "utf8",
    );
    sendJson(response, 200, { saved: true });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/recovery/clear") {
    requireStudioToken(request, true);
    await rm(AUTOSAVE_PATH, { force: true });
    sendJson(response, 200, { cleared: true });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/save") {
    requireStudioToken(request, true);
    const rawInput = await readJson(request);
    const input = parseStudioInput(rawInput);
    for (const media of input.story.media) {
      if (media.source !== "upload") continue;
      if (media.stagedName !== media.stagedName.split(/[\\/]/).pop()) {
        throw Object.assign(new Error("A staged media path is unsafe."), {
          status: 400,
        });
      }
      try {
        await access(join(UPLOAD_DIR, media.stagedName));
      } catch {
        throw Object.assign(
          new Error(`Staged media "${media.stagedName}" is missing.`),
          {
            status: 400,
          },
        );
      }
    }
    const catalog = buildStudioCatalog(
      await readCatalog(),
      input,
      new Date().toISOString(),
    );
    await writeCatalog(catalog);
    await rm(AUTOSAVE_PATH, { force: true });
    const savedStory = catalog.stories.find((story) =>
      input.storyId
        ? story.id === input.storyId
        : story.title === input.story.title,
    );
    sendJson(response, 200, { catalog, storyId: savedStory?.id });
    return;
  }

  sendJson(response, 404, { error: "Studio route not found." });
}

const server = createServer((request, response) => {
  handleRequest(request, response).catch((error: unknown) => {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? Number(error.status)
        : error instanceof z.ZodError
          ? 400
          : 500;
    const details =
      error instanceof z.ZodError
        ? error.issues.map(
            (issue) => `${issue.path.join(".") || "input"}: ${issue.message}`,
          )
        : error instanceof Error && error.name === "ZodError"
          ? formatCatalogIssues(error as z.ZodError)
          : [];
    const message =
      error instanceof Error ? error.message : "Unexpected studio error.";
    if (status >= 500) console.error(error);
    sendJson(response, status, { error: message, details });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Owner studio ready at ${ORIGIN}`);
  console.log("Localhost only. Close this terminal to stop all write access.");
});
