# Quality and security rules

## Architecture boundary

The first public site is read-only. The owner CMS/authoring studio must run locally, bind only to loopback (`127.0.0.1`/`localhost`), and must never be included in the public deployment output. It may write validated content and processed media into the repository; publication occurs through reviewed Git commits and deployment. This provides owner editing without a public login page or an internet-facing write endpoint.

If later requirements introduce remote editing or contributors, do not improvise an unauthenticated endpoint. Task 12 or 13 must add explicit authentication, authorization, moderation, quotas, backups, and auditability first.

## Required safeguards

- Never commit credentials, tokens, private keys, personal secrets, or local environment files.
- Treat repository content and CMS input as untrusted: validate schemas, sanitize rendered rich text, and escape output.
- Allowlist safe URL schemes and trusted embed providers; block script URLs and arbitrary HTML by default.
- Validate file type by content as well as extension, cap file sizes/counts, generate safe filenames, and prevent path traversal.
- Keep original travel media out of the public bundle when processed copies are sufficient. Preserve originals in their source folder unless the owner directs otherwise.
- Strip unnecessary metadata from public media where practical and document whether location metadata is retained.
- Use a restrictive Content Security Policy and appropriate security headers on the deployed site.
- Pin dependencies through the lockfile, run dependency/security checks, and review automated updates.
- Keep place data separate from story/visit data. A place can have many stories, and every story has its own required visit date.
- Never guess a location, fact, rating, price, accessibility claim, or practical detail.

## Experience quality

- Mobile-first and usable at keyboard-only, screen-reader, reduced-motion, zoomed-text, and high-contrast conditions.
- Every map interaction has an equivalent list or control-based path.
- Images have purposeful alternative text; decorative images use empty alt text.
- Avoid autoplaying sound or video. Respect bandwidth with responsive images, lazy loading, and posters.
- Test direct story URLs and social previews, not only navigation from the home page.
- Keep the compact header and preserve map/content visibility above the fold where practical.
