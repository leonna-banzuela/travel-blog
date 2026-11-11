# Travel content model

The first release stores content as validated repository data. The public website reads it; only the future localhost owner studio may write it.

## Record ownership

- **Geographic area** — a world, country, region, or locality in a parent hierarchy.
- **Place** — one stable map location. Coordinates and geographic membership belong here, not on individual stories.
- **Story/visit** — one creator's experience at one place on one required visit date. Repeat visits are separate stories.
- **Author** — creator identity and optional HTTPS profile links.
- **Media** — one image, video, or approved YouTube/Vimeo embed referenced by stories.

One place can therefore have many stories by the same or different authors. Story slugs include place, date, and author; the optional discriminator prevents a collision if an author publishes twice for the same place and date.

## Facts and perspectives

Story tips use an explicit `perspective`:

- `observed` — something the creator directly observed during that dated visit. It is not a permanent guarantee.
- `subjective` — a personal opinion, feeling, recommendation, or impression.

Do not present changing prices, hours, accessibility, Wi-Fi, climate, or crowd levels as timeless facts. The visit date gives every observation its necessary context.

## Controlled discovery tags

Tags are selected from the controlled vocabulary in `src/content/tags.ts`, grouped as:

- food and drink;
- study and work;
- setting;
- experience;
- climate;
- practical needs;
- study facilities.

Adding a new tag is a schema change. Do not accept free-form spelling variants into published records.

## Safe input rules

- External links require HTTPS.
- Local media must stay below `/media/`, use safe path segments, and never contain traversal or backslashes.
- Embeds are limited to approved YouTube and Vimeo hosts.
- Images require intrinsic dimensions and alternative text.
- Story Markdown rejects raw HTML, script URLs, and inline event handlers. Rendering must still sanitize Markdown output at the presentation boundary.
- IDs and slugs use lowercase letters, numbers, and single hyphens.
- All cross-record IDs, geographic parents, duplicate IDs/slugs, and parent cycles are validated before content is accepted.

## Query behavior

`findStories()` can resolve stories by place, an area and all its descendants, author, exact visit date, and combined controlled tags. Results are newest visit first. These relations power the future map, `More at this place`, and `More in this area` experiences without relying on ambiguous place-name matching.
