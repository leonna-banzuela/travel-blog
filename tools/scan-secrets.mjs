import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

const tracked = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  {
    encoding: "utf8",
  },
)
  .split("\0")
  .filter(Boolean)
  .filter(
    (file) =>
      !file.startsWith("blog_assets/") &&
      !file.startsWith("public/media/") &&
      !/\.(?:avif|gif|heic|jpe?g|mov|mp4|png|webp)$/i.test(file),
  );
const signatures = [
  {
    label: "private key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  { label: "GitHub token", pattern: /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/ },
  { label: "AWS access key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  {
    label: "generic credential assignment",
    pattern:
      /\b(?:api[_-]?key|client[_-]?secret|password)\s*[:=]\s*["'][^"'\n]{16,}["']/i,
  },
];
const findings = [];

for (const relative of tracked) {
  const content = await readFile(path.resolve(relative), "utf8");
  for (const signature of signatures) {
    if (signature.pattern.test(content))
      findings.push(`${relative}: ${signature.label}`);
  }
}

if (findings.length > 0)
  throw new Error(`Potential secrets found:\n- ${findings.join("\n- ")}`);
console.log(`Secret scan passed across ${tracked.length} tracked text files.`);
