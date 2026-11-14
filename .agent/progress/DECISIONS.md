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

## 2026-11-12 — Publish validated static reading routes

- Decision: Generate story, place, area, and creator pages from the validated catalog at build time; render story Markdown as text paragraphs until a reviewed Markdown renderer is introduced.
- Rationale: Readers receive direct, fast, shareable URLs while untrusted stored markup cannot execute and no public mutation surface is added.
- Consequence: Every published record must pass catalog validation before the build. Empty optional media and link collections omit their sections rather than leaving broken headings.

## 2026-11-12 — Seed Sandy Beach without inventing location data

- Decision: Publish the supplied author, visit date, and four-sentence Sandy Beach note now, use a modest 4/5 personal rating inferred from “nice,” and leave coordinates and media empty until Task 07.
- Rationale: This makes the real first reading path testable while preserving the rule against guessed real-world coordinates and unprocessed originals.
- Consequence: The owner can revise the inferred rating later. Task 07 must verify the place identity, process the source media, and attach the final gallery without rewriting the dated visit.

## 2026-11-12 — Use Leaflet with policy-compliant OpenStreetMap tiles

- Decision: Use pinned Leaflet `1.9.4` with the official OpenStreetMap Standard HTTPS tile endpoint for the small first release, preserve visible attribution, and prohibit prefetching or offline tile downloads.
- Rationale: This provides a familiar interactive Auckland overview with a permissively licensed client library while keeping the tile-provider obligations explicit and reviewable.
- Consequence: Reassess the tile provider before meaningful traffic or commercial use because the community service is best-effort. Normal browser caching/referrer behaviour and the exact required tile URL must remain intact.

## 2026-11-12 — Represent verified area context, not guessed place precision

- Decision: Show an editorial area-level Auckland symbol and an always-visible list while Sandy Beach coordinates are unverified; do not draw a false Auckland boundary or place marker.
- Rationale: The map should communicate that a published visit exists in the area without implying that the entire region was explored or that the beach location is known precisely.
- Consequence: Task 07 may replace the pending state with a verified place marker. Map failure must never block the geographic breadcrumb, place page, or story link.

## 2026-11-12 — Keep canonical content in one validated JSON catalog

- Decision: Store the repository's canonical author, place, media, and story records in `content/data/catalog.json`, import it through the shared catalog validator, and have the local studio update that same file deterministically.
- Rationale: One schema-validated source removes duplicate hand-maintained fixtures and lets both the static build and owner tool prove they use identical content rules.
- Consequence: Content changes must validate as a whole catalog before replacing the canonical file; ignored local backup and recovery data are not publishable content.

## 2026-11-12 — Defend the local studio in depth

- Decision: Bind the owner studio to IPv4 loopback only and combine exact host checks, same-origin mutation checks, an unpredictable process token, an HttpOnly SameSite cookie, restrictive response headers, content-sniffed uploads, safe filenames, and explicit public-bundle scanning.
- Rationale: Localhost is the primary boundary, but layered controls reduce the risk of DNS rebinding, cross-site requests, malicious uploads, traversal, and accidental deployment.
- Consequence: The first release has no remote editing or public write route. Remote authoring requires a separately designed authenticated and authorized service.

## 2026-11-12 — Use visit-media metadata for the Sandy Beach marker

- Decision: Publish the Sandy Beach visit marker at rounded coordinates `-36.9750, 174.6200`, supported by repeated GPS metadata across the supplied visit media.
- Rationale: Multiple files captured on the required visit date agree closely enough to identify the visit location without guessing or sending private source metadata to an external reverse-geocoding service.
- Consequence: The marker represents this recorded visit location, not a surveyed boundary. Source metadata stays outside the public bundle and the published coordinates are rounded rather than copied at maximum precision.

## 2026-11-12 — Publish a privacy-conscious derivative set

- Decision: Use two landscape-focused photos and one four-second silent video; exclude the long clip and people-focused frames. Generate AVIF/WebP sizes, an H.264 fast-start MP4, and a WebP poster without source metadata.
- Rationale: The selected set communicates the place while reducing identifiable-person exposure, download weight, autoplay/audio risk, and accidental GPS or camera-data disclosure.
- Consequence: Originals remain unchanged in `blog_assets/sandy_beach/`. Public pages use responsive variants and controls-only video; future media additions must follow the same review and metadata-removal workflow.

## 2026-11-12 — Keep discovery state shareable and saves local

- Decision: Encode supported discovery controls in validated URL parameters, preserve them through place/area/story exploration, keep canonical story URLs query-free, and store saved place IDs only in browser local storage.
- Rationale: Readers can share or revisit a precise discovery view without accounts, cookies, cloud profiles, or ambiguous related-content guesses.
- Consequence: New discovery controls must be allowlisted before entering URLs. Saved places are device/browser-specific, and relationship-based recommendations must continue to use catalog IDs and geographic links.

## 2026-11-12 — Enforce production quality in the normal verification chain

- Decision: Make accessibility, crawler metadata, broken links, file-size budgets, public-boundary checks, media integrity, CSP compatibility, secret scanning, and Chromium/Firefox/WebKit behavior part of `npm run verify`.
- Rationale: Release quality is more reliable when the same command enforces measurable budgets and high-risk boundaries instead of depending on a launch-day checklist alone.
- Consequence: New pages and assets must stay within the documented budgets and pass all three browser engines. The deployment build must set `SITE_URL` to its verified HTTPS origin before Task 10 can call the release public.

## 2026-11-13 — Gate Workers deployment behind verified GitHub environments

- Decision: Use pinned Wrangler static-assets configuration and one GitHub workflow whose preview and production jobs depend on the full verification job. Keep Cloudflare credentials in separate GitHub environments and never deploy forked pull requests.
- Rationale: The official Cloudflare Workers workflow supports preview deployments through `cloudflare/wrangler-action@v4`, while environment boundaries prevent unverified code and forked contributions from receiving deployment credentials.
- Consequence: Task 10 remains incomplete until a dedicated repository and scoped Cloudflare credentials exist, the real `SITE_URL` is configured, preview and production runs succeed, and rollback is observed. Unrelated repositories must not be reused merely because they are empty.

## 2026-11-14 — Use cookie-free Cloudflare Web Analytics

- Decision: Use one manually installed Cloudflare Web Analytics beacon for aggregate page, device, referral, geography, navigation, and real-user performance metrics; publish matching plain-language privacy copy.
- Rationale: The soft launch needs enough evidence to find device and performance problems without reader accounts, advertising identifiers, custom events, or query-string collection. Cloudflare already hosts the site and documents that Web Analytics does not track individuals across customer sites.
- Consequence: The public CSP permits only Cloudflare's documented beacon script and reporting origin. Any new vendor, custom event, account feature, or advertising tracker requires a separate privacy/security decision, updated copy, and tests before release.
