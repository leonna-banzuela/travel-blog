import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const source = path.join(
  projectRoot,
  "node_modules",
  "world-atlas",
  "land-110m.json",
);
const destination = path.join(
  projectRoot,
  "public",
  "data",
  "world-land-110m.json",
);

const topology = JSON.parse(await readFile(source, "utf8"));
const land = feature(topology, topology.objects.land);

await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, `${JSON.stringify(land)}\n`, "utf8");

console.log(
  `Generated ${path.relative(projectRoot, destination)} from Natural Earth 1:110m land data.`,
);
