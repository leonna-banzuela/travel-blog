import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const forbiddenPathParts = ["studio", "admin", "authoring"];
const forbiddenContent = [
  "/api/save",
  "/api/upload",
  "x-studio-token",
  "Leonna’s story studio",
  "Save validated draft",
];
const textExtensions = new Set([
  ".html",
  ".js",
  ".css",
  ".json",
  ".xml",
  ".txt",
]);

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(absolute)));
    else files.push(absolute);
  }
  return files;
}

const files = await collect(dist);
const violations = [];
for (const file of files) {
  const path = relative(dist, file).replaceAll("\\", "/");
  const lowerPath = path.toLowerCase();
  if (forbiddenPathParts.some((part) => lowerPath.split("/").includes(part))) {
    violations.push(`Forbidden public path: ${path}`);
  }
  if (!textExtensions.has(extname(file).toLowerCase())) continue;
  const content = await readFile(file, "utf8");
  for (const marker of forbiddenContent) {
    if (content.toLowerCase().includes(marker.toLowerCase())) {
      violations.push(`Forbidden studio marker "${marker}" in ${path}`);
    }
  }
}

if (violations.length > 0) {
  throw new Error(
    `Public boundary verification failed:\n${violations.join("\n")}`,
  );
}

console.log(`Public boundary verified across ${files.length} generated files.`);
