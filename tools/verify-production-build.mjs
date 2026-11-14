import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const distRoot = path.join(projectRoot, "dist");
const budgets = {
  htmlPerPage: 90 * 1024,
  javascriptTotal: 180 * 1024,
  javascriptPerFile: 170 * 1024,
  cssTotal: 60 * 1024,
  imagePerFile: 450 * 1024,
  videoPerFile: 1.5 * 1024 * 1024,
  mediaTotal: 3 * 1024 * 1024,
};

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(target) : [target];
    }),
  );
  return nested.flat();
}

function localTarget(fromFile, rawValue) {
  const value = rawValue.split("#")[0]?.split("?")[0] ?? "";
  if (!value || /^(?:https?:|mailto:|tel:|data:)/i.test(value)) return null;
  if (value.startsWith("/")) return path.join(distRoot, value.slice(1));
  return path.resolve(path.dirname(fromFile), value);
}

async function existsAsOutput(target) {
  const normalized = target.replace(/[\\/]+$/, "");
  for (const candidate of [
    normalized,
    `${normalized}.html`,
    path.join(normalized, "index.html"),
  ]) {
    try {
      if ((await stat(candidate)).isFile()) return true;
    } catch {
      // Try the next static-route form.
    }
  }
  return false;
}

function assertWithinBudget(label, actual, budget, failures) {
  if (actual > budget)
    failures.push(`${label}: ${actual} bytes exceeds ${budget} bytes.`);
}

const files = await filesUnder(distRoot);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const jsFiles = files.filter((file) => file.endsWith(".js"));
const cssFiles = files.filter((file) => file.endsWith(".css"));
const imageFiles = files.filter((file) =>
  /\.(?:avif|gif|jpe?g|png|webp)$/i.test(file),
);
const videoFiles = files.filter((file) => /\.(?:mp4|webm)$/i.test(file));
const failures = [];

const sizes = new Map(
  await Promise.all(files.map(async (file) => [file, (await stat(file)).size])),
);
for (const file of htmlFiles) {
  assertWithinBudget(
    path.relative(distRoot, file),
    sizes.get(file) ?? 0,
    budgets.htmlPerPage,
    failures,
  );
}
assertWithinBudget(
  "total JavaScript",
  jsFiles.reduce((total, file) => total + (sizes.get(file) ?? 0), 0),
  budgets.javascriptTotal,
  failures,
);
for (const file of jsFiles) {
  assertWithinBudget(
    path.relative(distRoot, file),
    sizes.get(file) ?? 0,
    budgets.javascriptPerFile,
    failures,
  );
}
assertWithinBudget(
  "total CSS",
  cssFiles.reduce((total, file) => total + (sizes.get(file) ?? 0), 0),
  budgets.cssTotal,
  failures,
);
for (const file of imageFiles) {
  assertWithinBudget(
    path.relative(distRoot, file),
    sizes.get(file) ?? 0,
    budgets.imagePerFile,
    failures,
  );
}
for (const file of videoFiles) {
  assertWithinBudget(
    path.relative(distRoot, file),
    sizes.get(file) ?? 0,
    budgets.videoPerFile,
    failures,
  );
}
assertWithinBudget(
  "total public media",
  [...imageFiles, ...videoFiles].reduce(
    (total, file) => total + (sizes.get(file) ?? 0),
    0,
  ),
  budgets.mediaTotal,
  failures,
);

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const route = path.relative(distRoot, file);
  const requiredPatterns = [
    [/<title>[^<]+<\/title>/, "title"],
    [/<meta name="description" content="[^"]+"/, "description"],
    [/<meta name="robots" content="[^"]+"/, "robots policy"],
    [/<link rel="canonical" href="[^"]+"/, "canonical URL"],
    [/<meta property="og:title" content="[^"]+"/, "Open Graph title"],
    [/<meta property="og:url" content="[^"]+"/, "Open Graph URL"],
    [/<meta name="twitter:card" content="[^"]+"/, "Twitter card"],
    [/<link rel="alternate" type="application\/atom\+xml"/, "feed discovery"],
  ];
  for (const [pattern, label] of requiredPatterns) {
    if (!pattern.test(html)) failures.push(`${route}: missing ${label}.`);
  }
  if (
    /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/.test(
      html,
    )
  ) {
    failures.push(
      `${route}: executable inline script would violate the production CSP.`,
    );
  }

  const jsonLdMatches = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  if (jsonLdMatches.length === 0)
    failures.push(`${route}: missing structured data.`);
  for (const match of jsonLdMatches) {
    try {
      JSON.parse(match[1] ?? "");
    } catch {
      failures.push(`${route}: structured data is not valid JSON.`);
    }
  }

  const linkedValues = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(
    (match) => match[1] ?? "",
  );
  for (const value of linkedValues) {
    const target = localTarget(file, value);
    if (target && !(await existsAsOutput(target)))
      failures.push(`${route}: broken local reference ${value}.`);
  }
}

for (const required of ["_headers", "feed.xml", "robots.txt", "sitemap.xml"]) {
  if (!(await existsAsOutput(path.join(distRoot, required))))
    failures.push(`Missing production output: ${required}.`);
}

const headers = await readFile(path.join(distRoot, "_headers"), "utf8");
for (const directive of [
  "Content-Security-Policy:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "https://static.cloudflareinsights.com/beacon.min.js",
  "https://cloudflareinsights.com",
  "Permissions-Policy:",
  "Referrer-Policy:",
  "X-Content-Type-Options: nosniff",
]) {
  if (!headers.includes(directive))
    failures.push(`_headers is missing ${directive}`);
}

if (failures.length > 0) {
  throw new Error(
    `Production verification failed:\n- ${failures.join("\n- ")}`,
  );
}

console.log(
  `Production build verified: ${htmlFiles.length} HTML pages, ${jsFiles.length} JS files, ${cssFiles.length} CSS files, and ${imageFiles.length + videoFiles.length} media files within budget.`,
);
