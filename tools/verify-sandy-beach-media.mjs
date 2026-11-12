import { createHash } from "node:crypto";
import { access, readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

import exifr from "exifr";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const sourceDirectory = join("blog_assets", "sandy_beach");
const publicDirectory = join("public", "media", "sandy-beach");
const originalHashes = new Map([
  [
    "IMG_0211.MOV",
    "7895AB1D3327A75700CDAB8088C302402C82DF54B1761A81618151CC9963D32C",
  ],
  [
    "IMG_0214.MOV",
    "8E22393601D502245F8A96E7CCE7F121B6016EF881F5AA5ED3727C0061AB4F7B",
  ],
  [
    "IMG_0215.MOV",
    "494960E39C935F54172EFF1D09077B89DB1EA90034318D27998FC50FDCE34DD5",
  ],
  [
    "IMG_0216.HEIC",
    "012D2F7CA897113F8DDDF7F1A4BA5E455EE58713A5F2988B47F0DEA89A9EC2CC",
  ],
  [
    "IMG_0218.HEIC",
    "9DAF5CEE04577C8A31BB09E20D0A5F515CE2F6AC6478A3A0DDDE250FCFC35468",
  ],
  [
    "IMG_0223.HEIC",
    "1C372847898C5C6D2855501E8A77690C0F5844B4D8C9B380836EF245186B760E",
  ],
  [
    "IMG_0233.HEIC",
    "EF8DEC53621FFD25969DC9FEC818B2EE37141378381F224EE1229955B816BE96",
  ],
  [
    "IMG_0237.HEIC",
    "9C125AC0F35F29DCF6D6E05E7AFE66B54187D1EC9CBB7E7B6540B906198FCA17",
  ],
]);

const expectedPublicFiles = [
  "beach-and-lawn-poster.webp",
  "beach-and-lawn.mp4",
  "pohutukawa-and-water-1280.avif",
  "pohutukawa-and-water-1280.webp",
  "pohutukawa-and-water-640.avif",
  "pohutukawa-and-water-640.webp",
  "rocky-shoreline-480.avif",
  "rocky-shoreline-480.webp",
  "rocky-shoreline-960.avif",
  "rocky-shoreline-960.webp",
].sort();

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex").toUpperCase();
}

const sourceAvailable = await access(sourceDirectory)
  .then(() => true)
  .catch(() => false);
if (sourceAvailable) {
  for (const [name, expected] of originalHashes) {
    const actual = sha256(await readFile(join(sourceDirectory, name)));
    if (actual !== expected) throw new Error(`Original media changed: ${name}`);
  }
}

const actualPublicFiles = (await readdir(publicDirectory)).sort();
if (JSON.stringify(actualPublicFiles) !== JSON.stringify(expectedPublicFiles)) {
  throw new Error(
    "The Sandy Beach public derivative set is incomplete or unexpected.",
  );
}

for (const name of actualPublicFiles.filter((file) =>
  /\.(avif|webp)$/i.test(file),
)) {
  const path = join(publicDirectory, name);
  const metadata = await sharp(path).metadata();
  if (metadata.exif || metadata.icc || metadata.xmp || metadata.iptc) {
    throw new Error(`Public image retains metadata: ${name}`);
  }
  const parsedExif = await exifr.parse(path).catch(() => undefined);
  if (parsedExif)
    throw new Error(`Public image exposes parsed EXIF data: ${name}`);
  if ((await stat(path)).size > 500_000) {
    throw new Error(`Public image is unexpectedly large: ${name}`);
  }
}

if (!ffmpegPath) throw new Error("ffmpeg-static did not provide a binary.");
const videoResult = spawnSync(
  ffmpegPath,
  [
    "-hide_banner",
    "-i",
    join(publicDirectory, "beach-and-lawn.mp4"),
    "-map",
    "0:v:0",
    "-f",
    "null",
    "-",
  ],
  { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
);
if (videoResult.status !== 0)
  throw new Error(videoResult.stderr || "Video verification failed.");
if (
  !/Video: h264/i.test(videoResult.stderr) ||
  !/720x1280/.test(videoResult.stderr)
) {
  throw new Error(
    "The public video is not the expected 720 × 1280 H.264 derivative.",
  );
}
const inputDescription = videoResult.stderr.split("Stream mapping:")[0] ?? "";
if (
  /location|creation_time/i.test(inputDescription) ||
  /^\s*Stream .*\b(?:Audio|Data):/im.test(inputDescription)
) {
  throw new Error(
    "The public video retains source metadata, audio, or data streams.",
  );
}
if (
  (await stat(join(publicDirectory, "beach-and-lawn.mp4"))).size > 2_000_000
) {
  throw new Error("The public video is unexpectedly large.");
}

console.log(
  sourceAvailable
    ? "Sandy Beach originals and public derivatives verified."
    : "Sandy Beach public derivatives verified; private originals are not present in this clean checkout.",
);
