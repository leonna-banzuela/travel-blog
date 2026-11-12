import { storyViews } from "../content/public-content";
import { siteCatalog } from "../content/site-data";
import { escapeXml, siteUrl } from "../lib/xml";

export const prerender = true;

export function GET({ site }: { site?: URL }) {
  const views = storyViews(siteCatalog);
  const updated = views[0]?.story.updatedAt ?? new Date(0).toISOString();
  const entries = views
    .map(({ story, author, place }) => {
      const url = siteUrl(`/stories/${story.slug}`, site);
      return `<entry><title>${escapeXml(story.title)}</title><id>${escapeXml(url)}</id><link href="${escapeXml(url)}"/><updated>${escapeXml(story.updatedAt)}</updated><published>${escapeXml(story.publishedAt ?? story.updatedAt)}</published><author><name>${escapeXml(author.name)}</name></author><summary>${escapeXml(story.summary)}</summary><category term="${escapeXml(place.name)}"/></entry>`;
    })
    .join("");
  const home = siteUrl("/", site);
  const feed = siteUrl("/feed.xml", site);
  const body = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Leonna’s travel journal</title><subtitle>Places, dated in ink.</subtitle><id>${escapeXml(home)}</id><link href="${escapeXml(home)}"/><link rel="self" href="${escapeXml(feed)}"/><updated>${escapeXml(updated)}</updated>${entries}</feed>`;

  return new Response(body, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}
