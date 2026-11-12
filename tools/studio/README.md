# Local owner authoring studio

The studio is a localhost-only CMS for Leonna. It is intentionally separate from the Astro public site and is never copied into `dist/`.

## Start it

```powershell
npm run studio
```

Open `http://127.0.0.1:4178` on the same computer. Closing the terminal stops all write access. `STUDIO_PORT` may select another non-privileged port; the server still binds only to `127.0.0.1`.

## What it supports

- create or reopen creators, places, and dated stories;
- required visit dates and personal ratings;
- controlled tags, observed/personal tips, and HTTPS links;
- optional verified coordinates or an explicit location-pending state;
- staged photos/videos, approved YouTube/Vimeo links, captions, alternative text, ordering, and cover selection;
- safe text-only local preview;
- browser and server autosave/recovery;
- canonical catalog validation before deterministic JSON writes.

The public application reads `content/data/catalog.json`. A new studio story is a `draft`, so it does not become a public page merely by being saved. Publication still requires review, a Git commit, and deployment.

## Security boundary

- The HTTP server listens on `127.0.0.1` only and rejects non-loopback Host headers.
- Mutations require a random per-process token plus the exact local Origin. No CORS permission is sent.
- A strict Content Security Policy, `frame-ancestors 'none'`, no-sniff, no-referrer, and same-origin opener policy protect the studio UI.
- Uploads are streamed with total and per-type limits, identified from magic bytes rather than extensions, renamed with safe content hashes, and stored under ignored `content/studio/uploads/`.
- Uploaded images are capped at 30 MB; videos are capped at 250 MB; a story can reference at most 50 media records.
- The canonical schemas reject path traversal, raw HTML/script Markdown, unsafe URLs, invalid coordinates/dates, missing relations, duplicate identities, and invalid media metadata.
- JSON catalog writes create a local ignored backup first. Autosave recovery stays in ignored `tools/studio/.studio-state/`.
- There is no login/signup page, public authoring route, public write endpoint, or studio code inside `src/`, `public/`, or `dist/`.

HEIC and MOV originals may be staged, but they are not automatically published. Images without detectable JPEG/PNG dimensions require width and height before the canonical image record can be saved. Task 07 processes the existing Sandy Beach originals into web-ready derivatives and documents metadata removal.
