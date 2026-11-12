import { createHash } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

import ffmpegPath from "ffmpeg-static";
import heicConvert from "heic-convert";
import sharp from "sharp";

const sourceDirectory = join("blog_assets", "sandy_beach");
const outputDirectory = join("public", "media", "sandy-beach");

const sourceHashes = new Map([
  [
    "IMG_0214.MOV",
    "8E22393601D502245F8A96E7CCE7F121B6016EF881F5AA5ED3727C0061AB4F7B",
  ],
  [
    "IMG_0216.HEIC",
    "012D2F7CA897113F8DDDF7F1A4BA5E455EE58713A5F2988B47F0DEA89A9EC2CC",
  ],
  [
    "IMG_0237.HEIC",
    "9C125AC0F35F29DCF6D6E05E7AFE66B54187D1EC9CBB7E7B6540B906198FCA17",
  ],
]);

const photoJobs = [
  {
    source: "IMG_0237.HEIC",
    stem: "pohutukawa-and-water",
    widths: [640, 1280],
  },
  {
    source: "IMG_0216.HEIC",
    stem: "rocky-shoreline",
    widths: [480, 960],
  },
];

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex").toUpperCase();
}

function runFfmpeg(args, options = {}) {
  if (!ffmpegPath) throw new Error("ffmpeg-static did not provide a binary.");
  const result = spawnSync(ffmpegPath, args, {
    encoding: options.binary ? null : "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(String(result.stderr || "FFmpeg failed."));
  }
  return result.stdout;
}

async function verifiedSource(name) {
  const buffer = await readFile(join(sourceDirectory, name));
  const expected = sourceHashes.get(name);
  if (!expected || sha256(buffer) !== expected) {
    throw new Error(
      `Source hash mismatch for ${name}; originals may have changed.`,
    );
  }
  return buffer;
}

async function processPhoto(job) {
  const source = await verifiedSource(job.source);
  const decoded = await heicConvert({
    buffer: source,
    format: "JPEG",
    quality: 0.94,
  });

  for (const width of job.widths) {
    const pipeline = sharp(decoded).resize({ width, withoutEnlargement: true });
    await pipeline
      .clone()
      .avif({ quality: 58, effort: 4 })
      .toFile(join(outputDirectory, `${job.stem}-${width}.avif`));
    await pipeline
      .clone()
      .webp({ quality: 82, effort: 5 })
      .toFile(join(outputDirectory, `${job.stem}-${width}.webp`));
  }
}

async function processVideo() {
  const sourceName = "IMG_0214.MOV";
  await verifiedSource(sourceName);
  const sourcePath = join(sourceDirectory, sourceName);
  const videoPath = join(outputDirectory, "beach-and-lawn.mp4");

  runFfmpeg([
    "-loglevel",
    "error",
    "-y",
    "-i",
    sourcePath,
    "-map",
    "0:v:0",
    "-map_metadata",
    "-1",
    "-vf",
    "scale=720:-2:flags=lanczos",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "23",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    videoPath,
  ]);

  const poster = runFfmpeg(
    [
      "-loglevel",
      "error",
      "-ss",
      "00:00:01",
      "-i",
      videoPath,
      "-frames:v",
      "1",
      "-map_metadata",
      "-1",
      "-f",
      "image2pipe",
      "-vcodec",
      "png",
      "pipe:1",
    ],
    { binary: true },
  );
  await sharp(poster)
    .webp({ quality: 82, effort: 5 })
    .toFile(join(outputDirectory, "beach-and-lawn-poster.webp"));
}

await mkdir(outputDirectory, { recursive: true });
for (const job of photoJobs) await processPhoto(job);
await processVideo();

console.log(`Processed Sandy Beach media into ${outputDirectory}.`);
