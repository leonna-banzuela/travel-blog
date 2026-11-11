# Decision log

## 2026-11-12 — Static public site with local owner CMS

- Decision: Ship a read-only public site and an owner-only local authoring studio for the first release.
- Rationale: The owner needs easy authoring, but the user explicitly does not want login/signup yet and requires protection from arbitrary editing. A localhost-only CMS with Git-reviewed publishing creates no public mutation endpoint.
- Consequence: Remote editing from an arbitrary device is deferred until authenticated owner/contributor infrastructure is deliberately added.

## 2026-11-12 — Place and story are separate records

- Decision: Model stable places separately from dated stories/visits.
- Rationale: The same creator may revisit a place on different dates, and several creators may write about one place.
- Consequence: Map coordinates and geographic hierarchy belong to the place; visit date, author, rating, copy, and media belong to each story.

## 2026-11-12 — GitHub backs every task version

- Decision: Each numbered task ends in a focused commit and GitHub push once the remote is configured.
- Rationale: Small recoverable versions make experimentation and rollback safe.
- Consequence: A task is not described as backed up remotely until the push is verified and recorded.

## 2026-11-12 — Compact map-first header

- Decision: Use compact navigation/controls and avoid a large introductory hero above the map.
- Rationale: This is the final visual correction recorded in the shared demo chat and keeps the core experience visible on mobile.
- Consequence: Brand and explanation copy must not displace the map or story discovery controls.

## 2026-11-12 — Preferred implementation direction, pending Task 01 validation

- Decision: Evaluate Astro + TypeScript for the content-heavy public site, interactive islands for map/filter behavior, schema validation, a local Node-based authoring studio, and Cloudflare Pages deployment.
- Rationale: This favors pre-rendered, shareable, fast pages while isolating interactive features and keeping the public build read-only.
- Consequence: Task 01 may refine the exact libraries after checking current compatibility and deployment constraints; changes require a new decision entry.

## 2026-11-12 — Foundation stack validated

- Decision: Use a static Astro `7.3.8` + strict TypeScript foundation, Vitest for unit tests, Playwright for browser smoke tests, ESLint for JavaScript/Astro, and Prettier for formatting. Keep the owner studio isolated under `tools/studio/`.
- Rationale: Astro matches the content-first, shareable-page requirements. Version `7.3.8` contains the available security fixes while remaining compatible with the machine's Node `22.21.1`; Astro `7.4.11` requires Node `22.23.4+`. The locked dependency graph audits cleanly.
- Consequence: Upgrade Astro and Node together once the local runtime can meet the newer documented minimum. Public code remains statically generated and read-only.

## 2026-11-12 — Prefer Cloudflare Workers for eventual deployment

- Decision: Replace the earlier tentative Cloudflare Pages target with a static-assets Cloudflare Workers deployment during Task 10.
- Rationale: Current official Astro deployment guidance says Cloudflare recommends Workers for new projects.
- Consequence: Task 10 will add Wrangler and deployment configuration only after the public application is production-ready; Task 01 does not add runtime or mutation endpoints.

## 2026-11-12 — Validate content at record and catalog boundaries

- Decision: Use pinned Zod 4 schemas for individual records and a separate catalog validator for cross-record identity, relationship, and geographic-cycle checks.
- Rationale: A record can be structurally valid while still pointing to a missing author, place, media item, or area. Keeping both validation layers makes authoring errors actionable before a build is published.
- Consequence: New content sources and the future local studio must pass the same schemas and catalog validation before committing generated content.

## 2026-11-12 — Permit safe Markdown and allowlisted media only

- Decision: Story content is Markdown without raw HTML; external links must use HTTPS, local media paths must stay under `/media/`, and remote video embeds are limited to YouTube and Vimeo HTTPS URLs.
- Rationale: The first release is read-only, but unsafe stored content could still become executable when rendered. Restricting accepted inputs reduces that risk at the content boundary.
- Consequence: Additional embed providers or rich HTML require an explicit security review and schema change rather than being accepted implicitly.

## 2026-11-12 — Do not invent real-world location facts

- Decision: Use fictional coordinates and people in automated fixtures and leave Sandy Beach coordinates unset until verified from a reliable source.
- Rationale: Tests need realistic relationships but must not turn guessed location data into published fact.
- Consequence: Task 07 must verify the exact Sandy Beach identity and coordinates before publishing the first story or map marker.

## 2026-11-12 — Use a paper-and-ink editorial system

- Decision: Build the interface from warm paper surfaces, dark ink, pale map lines, restrained terracotta/sea/yellow accents, a system serif editorial face, and a system sans-serif control face.
- Rationale: The visual language should feel personal and travel-journal-like without loading third-party fonts or competing with photographs, maps, and story text.
- Consequence: Future components should reuse the central tokens and preview route. Decorative rotation stays subtle and is removed on small screens; motion and colour must retain accessible fallbacks.
