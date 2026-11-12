# Production readiness and recovery

## Release checks

Run `npm ci`, then `npm run verify`. The verification chain checks formatting, linting, strict types, unit tests, a production build, public-media integrity, the public/private boundary, SEO and broken links, performance budgets, secrets, and browser behavior. Run `npm audit --audit-level=high` before a release.

Set `SITE_URL` to the final HTTPS origin during the deployment build. Local builds deliberately use `http://127.0.0.1:4321` only inside generated sitemap/feed data; Task 10 must prove the deployed build contains its real origin.

## Performance budgets

The production-build verifier enforces these compressed-independent file-size ceilings:

- HTML: 90 KB per page.
- JavaScript: 170 KB per file and 180 KB total.
- CSS: 60 KB total.
- Images: 450 KB per derivative.
- Video: 1.5 MB per file.
- All published image/video derivatives: 3 MB total.

System fonts avoid third-party font requests. Responsive images include dimensions, `srcset`, lazy loading, and async decoding. Videos use posters, controls, no autoplay, and no published audio. Hashed Astro assets receive immutable caching; named media receive a shorter revalidation window.

## Accessibility and failure checks

Automated axe checks cover the home/map, list, story, 404, and owner studio. Browser tests cover keyboard form submission, direct links, 320-pixel layouts, and 200% text sizing. Before a release, manually confirm focus order and visible focus, map/list parity, headings and landmarks, reduced motion, forced-colour readability, alternative text, form errors, and the studio save/recovery path.

The public site is static: its useful 404 page handles unknown routes, and the accessible list remains usable when map tiles fail. A service worker is intentionally omitted so an old story or schema cannot remain invisibly cached as an “offline” version.

## Privacy and logging

The public build has no mutation API, analytics, advertising request, login, or cloud saved-place profile. Saved place IDs stay in local storage. The local studio binds to loopback and reports actionable validation messages without logging story bodies, original metadata, cookies, or its process token.

## Restore content and media

1. Check out the last known-good Git commit or tag in a fresh directory.
2. Run `npm ci` and `npm run verify` before using the copy.
3. Restore missing originals from the private `blog_assets/` backup if media must be regenerated. Never substitute guessed coordinates or an unrelated photo.
4. Run the documented media processor for the affected story, then run `npm run verify:media`.
5. Start `npm run studio`, confirm the expected catalog in the preview, and save only after validation succeeds.
6. Commit the restored catalog and derivatives as a new recoverable version; do not rewrite shared history.

The canonical content file is `content/data/catalog.json`. Local studio recovery snapshots and catalog backups are convenience copies, not a substitute for Git and the separately preserved source assets.
