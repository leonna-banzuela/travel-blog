# Build status

Last updated: 14 November 2026 (Pacific/Auckland)

Overall status: The first release is live, protected, and tagged as `v0.1.0`. Task 11 is in progress with privacy-first analytics, public privacy copy, and soft-launch materials prepared; observed tester sessions remain.

Next task: `11-soft-launch-and-feedback.md`

## Task tracker

| Task                                                      | Status      | Notes/evidence                                                                                                                                                                                                  | GitHub version                                                                                  |
| --------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 00 Requirements and plan                                  | Complete    | Shared roadmap inspected in the in-app browser; eight Sandy Beach media files inventoried; `.agent` harness created and validated. The original interactive artifact itself was not exposed by the shared page. | Local commit `d6024dc`; GitHub push pending sign-in                                             |
| 01 Repository foundation                                  | Complete    | Static Astro/TypeScript app, strict checks, unit and browser tests, local studio boundary, clean dependency audit, and responsive visual QA completed.                                                          | Local commit `6b74484`; GitHub repository creation unavailable through the connected GitHub app |
| 02 Content and location model                             | Complete    | Strict record schemas, safe content rules, relationship validation, repeated-visit fixtures, geographic filtering, and documentation verified.                                                                  | Local commit `4870169`; GitHub repository creation unavailable through the connected GitHub app |
| 03 Editorial design system                                | Complete    | Map-first responsive shell, shared controls/cards/states, component preview, accessibility reflow checks, and three viewport screenshots verified.                                                              | Local commit `a5e420f`; GitHub repository creation unavailable through the connected GitHub app |
| 04 Public reading experience                              | Complete    | Static story/list, place, area, creator, and 404 routes; Sandy Beach seed story; safe optional sections; sharing; and core reading tests verified.                                                              | Local commit `ef7ac6d`; GitHub repository creation unavailable through the connected GitHub app |
| 05 Map and geographic discovery                           | Complete    | Attributed Auckland map, area-level story cue, geographic navigation, keyboard/screen-reader support, list parity, and tile-failure fallback verified.                                                          | Local commit `a69d38e`; GitHub repository creation unavailable through the connected GitHub app |
| 06 Owner authoring studio                                 | Complete    | Loopback-only CMS, schema-validated deterministic saves, inspected media uploads, safe preview, autosave/recovery, and public-build exclusion verified.                                                         | Local commit `9e46248`; GitHub repository creation unavailable through the connected GitHub app |
| 07 Sandy Beach story and media                            | Complete    | Exact four-sentence story, verified map point, responsive metadata-free photos, silent short video, cover cards, and social image metadata verified.                                                            | Local commit `b3a3521`; GitHub repository creation unavailable through the connected GitHub app |
| 08 Filters, search, related content, and sharing          | Complete    | Combinable URL filters, synchronized map/list results, search/sort, local-only saves, canonical sharing, and relationship-based related reading verified.                                                       | Local commit `9404c71`; GitHub repository creation unavailable through the connected GitHub app |
| 09 Quality, accessibility, SEO, performance, and security | Complete    | Cross-browser axe coverage, crawler/social metadata, feed/sitemap, CSP/headers, production budgets, secret scanning, and recovery instructions verified.                                                        | Local commit `d2889a4`; GitHub repository creation unavailable through the connected GitHub app |
| 10 GitHub CI and deployment                               | Complete    | Protected GitHub workflow, isolated PR previews, automated production deployment, live route/header checks, rollback recovery, and milestone tag are verified.                                                  | PR #2 merge `00489f8`; tag `v0.1.0`; Workers version `10c4bf62`                                 |
| 11 Soft launch and feedback                               | In progress | Privacy-first analytics and matching copy are live; tester protocol/log, social package, and release-note draft are prepared. Real sessions with 5–10 testers remain.                                           | PR #4 merge `56e8616`; Workers version `851c1a02`                                               |
| 12 Creator pilot                                          | Not started | Later phase; not first release.                                                                                                                                                                                 | —                                                                                               |
| 13 Public submissions and moderation                      | Not started | Later phase; requires authentication and authorization.                                                                                                                                                         | —                                                                                               |
| 14 Monetisation and global expansion                      | Not started | Later phase; only after evidence supports it.                                                                                                                                                                   | —                                                                                               |

## Planning verification

- Confirmed `.agent/instructions`, `.agent/progress`, and `.agent/tasks` exist.
- Confirmed the Sandy Beach folder contains five `.HEIC` files and three `.MOV` files.
- Confirmed the workspace was not a Git repository at discovery time, then initialized `main` and committed Task 00 as `d6024dc`.
- Confirmed GitHub CLI was not installed or available at planning time.
- Confirmed the built-in browser reaches GitHub's sign-in page rather than an authenticated repository-creation page.
- Requirement traceability and Markdown/link checks must be run after all planning files are written.

## Task 01 verification

- Runtime: Node `22.21.1`, npm `10.9.4`, Astro `7.3.8` pinned to the last audited release compatible with the local Node runtime.
- Clean install: `npm ci` completed from `package-lock.json`.
- Full verification: `npm run verify` passed formatting, ESLint, strict Astro/TypeScript checks, 2 unit tests, the static production build, and the Chromium browser smoke test.
- Security: `npm audit --audit-level=low` reported 0 vulnerabilities; no public mutation route or owner-studio code is included in `dist/`.
- Visual QA: inspected the live page at mobile, tablet, and desktop viewport classes; no horizontal overflow was present, the mobile header measured 56 px, and the map placeholder collapsed to one column.
- GitHub: the connected account is `leonna-banzuela`, but it has no travel-blog repository and the available connector can work only with existing repositories. The browser remains signed out, so a remote cannot yet be created or pushed.

## Task 02 verification

- Content records: strict Zod schemas cover geographic areas, authors, places, media, stories/visits, and controlled tag groups.
- Repeated visits: tests prove that one author can publish independently dated stories about the same place and that another author can publish there too.
- Relationships: catalog validation rejects duplicate IDs/slugs, missing area/place/author/media records, and geographic cycles.
- Safe input: tests reject invalid ISO dates, non-HTTPS links, unsafe media paths and embeds, out-of-range coordinates, raw HTML, and publication-state inconsistencies.
- Discovery: tested queries resolve stories by place, descendant geographic area, author, exact visit date, and combined tags.
- Full verification: `npm run verify` passed formatting, linting, strict type checks, 14 unit tests, the static build, and the Chromium smoke test.
- Security: `npm audit --audit-level=low` reported 0 vulnerabilities.

## Task 03 verification

- Visual system: warm paper and ink tokens, restrained terracotta/sea/note accents, editorial and UI type stacks, borders, shadows, spacing, and motion rules are defined centrally.
- Shell and components: compact header, desktop side rail, mobile navigation, discovery controls, buttons, chips, story cards, sticky notes, and empty/error/loading states render on the public shell and `/design-system` preview.
- Automated browser checks: three Chromium tests cover the read-only shell, 320-pixel component-preview reflow, and simulated 200% root text sizing without horizontal page overflow.
- Accessibility: interactive controls use 44-pixel minimum heights, keyboard focus is visibly outlined, reduced-motion and forced-colour media queries are present, and the sticky note loses rotation on small screens.
- Visual QA: inspected the live site in the app's built-in browser and corrected a stretched side-rail layout found during review.
- Screenshot records: full-page mobile (390 × 844), tablet (768 × 1024), and desktop (1440 × 1000) captures are stored in `docs/screenshots/`.

## Task 04 verification

- Static routes: the production build generated 10 pages, including the story list/detail, Sandy Beach place, Auckland and parent-area collections, Leonna's creator profile, and 404 page.
- First story: Leonna Banzuela's supplied four-sentence Sandy Beach note is published with `Visited on 1 November 2026`; exact coordinates and media remain deliberately unset.
- Reading features: story pages include attribution, personal rating, tips, progressive sharing, connected place/area navigation, safe optional media/links, and a labelled unloaded future sponsor position.
- Optional content: browser tests confirm that empty media and external-link collections produce no orphan headings.
- Automated checks: 16 unit tests and 6 Chromium tests pass, including repeat-visit ordering, discovery-to-story navigation, direct metadata, related routes, unknown-route handling, 320-pixel reflow, and simulated 200% text sizing.
- Visual QA: inspected the live Sandy Beach story in the app's built-in browser at its compact viewport; content and navigation remain readable without horizontal overflow.
- Security: content is catalog-validated before build, story copy renders as text rather than executable markup, external links remain HTTPS-only, and the public output has no mutation endpoint.

## Task 05 verification

- Map stack: Leaflet `1.9.4` and its types are pinned; `npm audit --audit-level=low` remains clean.
- Attribution/licensing: the map and adjacent help text visibly link `© OpenStreetMap contributors`; repository documentation records Leaflet's BSD-2-Clause licence and OpenStreetMap's tile usage restrictions.
- Meaning: the dashed editorial marker is labelled as an Auckland-area cue for one published visit, not a boundary or a claim that all of Auckland was explored.
- Geographic path: World → New Zealand → Auckland links connect to area pages; the map popup, place card, place page, and story page preserve the discovery path.
- Accessibility: Leaflet keyboard navigation and zoom controls are enabled, the area symbol has a descriptive label, the map has a screen-reader summary and non-colour legend, and the same place/story actions are always present in the list.
- Fallback: exact Sandy Beach coordinates remain unset; a browser test aborts all OpenStreetMap tile requests and still reaches the place and story through the list.
- Automated checks: 16 unit tests and 8 Chromium tests pass, including 320-pixel and 200% text reflow coverage.
- Visual QA: inspected live tiles, attribution, the map/list responsive layout, and the activated Auckland popup in the app's built-in browser.

## Task 06 verification

- Owner boundary: the studio binds only to `127.0.0.1`, rejects non-loopback hosts and cross-origin mutations, uses a random per-process token plus an HttpOnly SameSite cookie, and applies restrictive browser headers.
- Authoring: create/edit/preview supports authors, hierarchical places, required visit dates, ratings, controlled tags, tips, HTTPS links, inspected file uploads, approved video embeds, media ordering, and cover selection.
- Safety: uploaded JPEG, PNG, WebP, AVIF, HEIC, MP4, MOV, and WebM files are content-sniffed with size limits and safe hashed names; traversal, raw HTML, invalid dates/links/coordinates, and inconsistent catalog data are rejected.
- Recovery: autosave/recovery and catalog backup state remain local and Git-ignored; canonical content is written deterministically to `content/data/catalog.json`.
- Browser QA: created a temporary complete draft, uploaded a PNG, previewed it, saved and reloaded it, found and fixed tag state loss after save, then confirmed tags, tips, media, cover choice, date, rating, and copy survive a second save.
- Automated checks: `npm run verify` passed formatting, linting, strict type checks, 24 unit tests, the 10-page static build, the public-boundary scan across 13 generated files, and 8 Chromium tests.
- Security: `npm audit --audit-level=low` reported 0 vulnerabilities; the temporary verification story was removed from canonical content before committing.

## Task 07 verification

- Source integrity: all five HEIC photos and three MOV videos were inventoried and visually reviewed; all 8 post-task SHA-256 hashes match the pre-task inventory.
- Location evidence: five photo records and three video records cluster around `-36.9750, 174.6200` on 1 November 2026; the public marker uses the rounded coordinates and no third-party reverse-geocoder received the originals' precise metadata.
- Privacy selection: published `IMG_0237`, `IMG_0216`, and the short `IMG_0214` clip; excluded the long video and people-focused frames, and removed the selected video's audio.
- Efficient media: generated two-width AVIF/WebP photo sets, a 720-pixel H.264 fast-start MP4, and a WebP poster; public files range from about 40 KB to 1.33 MB.
- Metadata: inspected every public image derivative and found no EXIF/ICC payload; the MP4 contains no location, camera creation time, audio, or source data streams.
- Authoring: reopened and saved the published record through the loopback studio with exact copy, date, rating, tags, tips, three ordered media records, responsive variants, poster, and cover preserved.
- Public experience: cover photos now appear on cards; the story exposes responsive image sources, controls-only silent video, exact four-sentence copy, Open Graph/Twitter image metadata, and verified map/list discovery.
- Visual QA: built-in browser checks at mobile, tablet, and desktop sizes found no horizontal overflow; inspected story media, portrait video proportions, cover card, exact marker, accessible list, and map popup.
- Automated checks: `npm run verify` passed formatting, linting, strict type checks, 24 unit tests, a 10-page static build, boundary scanning across 23 generated files, and 8 Chromium tests; `npm audit --audit-level=low` reported 0 vulnerabilities.

## Task 08 verification

- Discovery: search, newest/oldest/rating sort, and controlled category, setting, experience, climate, practical-needs, and facilities filters combine through validated URL parameters.
- Map/list parity: filtering hides and restores the matching accessible place card and Leaflet marker together; the empty state and result count update without a reload.
- Context: story, place, and area routes retain active discovery parameters, while canonical metadata and copied story links deliberately remain query-free.
- Relationships: unit tests prove `More at this place` uses shared place IDs and `More in this area` uses catalog geography while excluding the current story and place.
- Privacy: saved place IDs remain in browser local storage with explicit no-account/no-cloud copy; no personal data or public write endpoint was introduced.
- Accessibility and responsive QA: direct URL restoration, keyboard form submission, clear-filter recovery, mobile 320-pixel reflow, and simulated 200% text sizing pass browser tests.
- Visual QA: inspected combined and empty filter states at mobile size, saved results at tablet size, and canonical sharing at desktop size in the built-in browser.
- Automated checks: `npm run verify` passed formatting, linting, strict type checks, 25 unit tests, a 10-page static build, media verification, boundary scanning across 23 generated files, and 11 Chromium tests; `npm audit --audit-level=high` reported 0 vulnerabilities.

## Task 09 verification

- Accessibility: axe found no serious or critical findings on the home/map, story list, story, place, 404, or owner studio flows in Chromium, Firefox, and WebKit; the map marker and studio repeat groups received valid roles.
- SEO and sharing: every public HTML page has title, description, robots policy, canonical link, Open Graph, Twitter, feed discovery, and parseable JSON-LD; story pages publish `BlogPosting` data.
- Crawlers: static Atom feed, sitemap, and robots routes are generated and browser-tested; utility and missing pages are explicitly excluded from indexing.
- Security: Cloudflare-compatible headers set a restrictive CSP, frame/object/form boundaries, permissions policy, referrer policy, and MIME sniffing protection; executable scripts are emitted as external assets so CSP does not require `unsafe-inline`.
- Performance: the production verifier passed 10 HTML pages, 5 JavaScript files, 2 CSS files, and 13 media assets against recorded per-page, per-asset, and total budgets; immutable hashed-asset and revalidating media cache rules are present.
- Recovery and privacy: documentation covers real-origin builds, release checks, failure behavior, privacy-safe logging, Git restore, source-media restoration, regeneration, and studio validation. No analytics, cloud profile, public mutation endpoint, or service worker was added.
- Browser coverage: 60 Playwright checks passed across Chromium, Firefox, and WebKit, including direct URLs, map failure, URL filters, saved places, clipboard behavior where supported, metadata, and axe scans.
- Visual QA: inspected the production build in the built-in browser at mobile home, tablet studio, and desktop story sizes; layout, focusable controls, media, and recovery paths remained usable.
- Automated checks: `npm run verify` passed formatting, linting, strict type checks, 27 unit tests, the 10-page static build, public-media integrity, boundary scanning across 34 files, production/broken-link budgets, a 94-file secret scan, and 60 browser tests; `npm audit --audit-level=high` reported 0 vulnerabilities.

## Task 10 progress

- CI: `.github/workflows/release.yml` runs a locked install, all three browser engines, the complete verification chain, production-only dependency audit, and Wrangler dry run before any deployment job.
- Deployment: pinned Wrangler `4.160.1` serves `dist/` as Cloudflare Workers static assets; same-repository pull requests use isolated previews and verified `main` pushes use the production environment.
- Secrets: workflows reference GitHub environment secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, plus the non-secret `SITE_URL` variable; forked pull requests do not receive deployment credentials.
- Clean checkout: a fresh local clone with no private originals completed `npm ci`, the full 27-unit/60-browser verification chain, derivative-only media verification, production checks, and `wrangler deploy --dry-run` successfully.
- Repository hygiene: original HEIC/MOV assets remain untracked, the local object database is about 4.18 MiB, and `.gitattributes` enforces LF text checkouts so formatting is reproducible on Windows and Linux.
- GitHub publication: created the public `leonna-banzuela/travel-blog` repository on 14 November 2026, attached it as `origin`, and pushed the complete `main` history through commit `e25fc5f`.
- Hosted CI: GitHub Actions run `43502457302` completed the locked clean-checkout verification, all 27 unit tests, all 60 browser checks, the production dependency audit, and the Wrangler dry run successfully.
- Deployment preflight: the production job stopped before deployment because `SITE_URL` and Cloudflare credentials are not configured; the workflow now reports missing configuration explicitly before attempting a build.
- Cloudflare credential: created `travel-blog-github-deploy`, scoped to this account with only Workers Scripts Edit and a 14 November 2027 expiry. The token value is not stored in repository files.
- Public release: built with `SITE_URL=https://leonnas-travel-journal.leonnabanzuela0516.workers.dev`, passed the production verifier, and deployed Workers version `bd38e5db-5520-486d-a2d3-b2a38b92d96e`.
- Public verification: the home and direct Sandy Beach story URLs return 200 with CSP, referrer policy, and MIME-sniffing protection; canonical metadata uses the live origin. Playwright checks at 390-pixel mobile and 1440-pixel desktop widths found no horizontal overflow and confirmed the author and visit date.
- GitHub environments: `production` and `preview` each contain encrypted `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets plus the public `SITE_URL` variable. No credential value was committed or printed into a repository file.
- Preview deployment: pull request #1 run `43507572302` passed `Verify clean checkout` and deployed an isolated Workers preview at `pr-1-leonnas-travel-journal.leonnabanzuela0516.workers.dev`. The preview home and direct Sandy Beach story routes returned 200, included the required story copy, and served the production CSP.
- Automated production deployment: after pull request #1 merged, run `43508086399` passed verification and deployed Workers version `5d3f5ca2-b4c3-428e-8a51-27150158c5bc` to the public URL.
- Rollback drill: rolled the live Worker back from `5d3f5ca2-b4c3-428e-8a51-27150158c5bc` to known-good version `debff308-ae76-4663-a6a3-4c6b43f00cdd`; both the home and direct Sandy Beach story routes returned 200 with the story copy and CSP. Restored `5d3f5ca2-b4c3-428e-8a51-27150158c5bc` and reverified both routes, the canonical URL, and security headers.
- Final release-record PR: pull request #2 run `43541828386` passed the full clean-checkout verification and isolated preview deployment. The preview home and direct story routes returned 200 with CSP; the story contained the required four sentences, author, and visit date.
- Protected branch: `main` requires pull requests, the GitHub Actions `Verify clean checkout` status check, and resolved conversations; administrator bypass, force pushes, and branch deletion are disabled. Required approvals remain disabled so the sole owner is not locked out.
- Protected merge and release: pull request #2 merged as `00489f8`; production run `43542822254` passed verification and deployment, publishing Workers version `10c4bf62-9744-4d24-846c-a6a517ee647b`. The live home and direct Sandy Beach story routes were rechecked with CSP, exact story copy, author, and visit date present.
- Milestone: annotated tag `v0.1.0` points to the verified pull request #2 merge and is present on GitHub.

## Current blockers

- Task 11 requires 5–10 real people who did not build the site. Tester findings and retests cannot be invented or replaced by automated checks; the prepared guide and log are ready for the owner to use.

## Task 11 verification

- Cloudflare Web Analytics: created a site entry for the production Workers hostname and installed its public, non-administrative beacon in the shared layout. The CSP allows only the documented beacon script and reporting origin.
- Privacy: added an indexed `/privacy` route that documents the exact Cloudflare dimensions, performance timing, retention statement, lack of query-string/custom-event collection, local saved-place storage, and absence of accounts or advertising trackers.
- Launch kit: added a seven-task tester script, severity rubric, ten anonymized tester slots, structured finding/retest template, direct-link social copy, link-preview alt text, and a release-note/retrospective draft.
- Automated verification: `npm run verify` passed formatting, lint, type checks, 27 unit tests, the 11-page production build, media/boundary/production/security checks, and 63 browser checks. After adding `/privacy` to the shared axe route list, lint, type checks, build, production verification, and all 21 focused Chromium/Firefox/WebKit accessibility checks passed.
- Visual QA: inspected `/privacy` at 390×844, 768×900, and 1440×1000 in the built-in browser. The page remained readable with no horizontal overflow at each viewport.
- Hosted preview: pull request #4 run `43544730269` passed the protected clean-checkout job and isolated preview deployment. The preview `/privacy/` route returned 200 with the analytics beacon and both required CSP origins.
- Production: pull request #4 merged as `56e8616`; run `43544997258` passed verification and deployed Workers version `851c1a02-b7cf-4c54-a68f-273c0ebeed77`. The live privacy route returned 200 with matching copy, beacon, and CSP.
- Analytics dashboard: completed the Cloudflare setup wizard for the production hostname and reached the Web Analytics dashboard. It correctly showed no data immediately after first deployment; metrics can take time and must not be invented.
- Internal live QA: verified combined beach/relaxing filters, clear behavior, shareable query state, the first ten mobile keyboard stops, 200%-class zoom reflow, map/list parity, direct story metadata/copy/tip/media controls, canonical sharing, and an error-free browser console. The evidence is recorded in `docs/soft-launch/internal-qa.md` and is explicitly not counted as an external tester session.
