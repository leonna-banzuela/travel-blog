import { siteUrl } from "../lib/xml";

export const prerender = true;

export function GET({ site }: { site?: URL }) {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /design-system",
    `Sitemap: ${siteUrl("/sitemap.xml", site)}`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
