import { storyViews } from "../content/public-content";
import { siteCatalog } from "../content/site-data";
import { escapeXml, siteUrl } from "../lib/xml";

export const prerender = true;

export function GET({ site }: { site?: URL }) {
  const entries = [
    { path: "/", updatedAt: siteCatalog.stories[0]?.updatedAt },
    { path: "/stories", updatedAt: siteCatalog.stories[0]?.updatedAt },
    { path: "/privacy", updatedAt: "2026-11-14" },
    ...siteCatalog.areas.map((area) => ({
      path: `/areas/${area.slug}`,
      updatedAt: area.updatedAt,
    })),
    ...siteCatalog.places.map((place) => ({
      path: `/places/${place.slug}`,
      updatedAt: place.updatedAt,
    })),
    ...siteCatalog.authors.map((author) => ({
      path: `/creators/${author.slug}`,
      updatedAt: author.updatedAt,
    })),
    ...storyViews(siteCatalog).map(({ story }) => ({
      path: `/stories/${story.slug}`,
      updatedAt: story.updatedAt,
    })),
  ];
  const urls = entries
    .map(
      ({ path, updatedAt }) =>
        `<url><loc>${escapeXml(siteUrl(path, site))}</loc>${updatedAt ? `<lastmod>${escapeXml(updatedAt)}</lastmod>` : ""}</url>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    },
  );
}
