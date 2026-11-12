# Public reading experience

The static public site resolves validated repository content into shareable reading routes. It has no public content-writing endpoint and requires no account.

## Published routes

- `/stories` — all published visits, ordered by visit date.
- `/stories/[slug]` — the full dated story with author, personal rating, tips, optional media and links, share control, and connected place/area navigation.
- `/places/[slug]` — every published visit to one stable place, keeping repeat visits distinct.
- `/areas/[slug]` — stories in an area and its descendants.
- `/creators/[slug]` — the creator profile and published stories.
- `/404.html` — a useful not-found state for unknown direct routes.

Story slugs contain the place, visit date, and author, so a later visit receives a different URL without replacing the earlier entry.

## Safe rendering boundaries

- All route data is created through the validated catalog before static generation.
- Story Markdown is currently rendered as text paragraphs, so stored markup cannot execute.
- External links are schema-validated HTTPS links and open without passing referrer data.
- Local media paths and approved video embeds retain the schema allowlists defined by the content model.
- Empty media and external-link collections omit their section headings and spacing entirely.
- The share control uses the browser share sheet when available and otherwise copies only the current public URL.

## First story seed

The first published route contains the user-supplied Sandy Beach visit by Leonna Banzuela on 1 November 2026. Its four-sentence entry records that the beach was nice, the water invited a swim, and no swimsuit was available. Exact coordinates and original trip media remain unset until the dedicated media task verifies and processes them.
