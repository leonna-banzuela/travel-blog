# Task 06 — Owner authoring studio

Status: Complete

Depends on: Tasks 02, 04, and 05

## Objective

Provide a simple owner CMS for writing stories and adding media, links, dates, tags, ratings, tips, and map locations without exposing public editing.

## Actions

- Build a local-only authoring studio that binds to loopback and is excluded from the public deployment.
- Support create/edit/preview for places, authors, and stories; make visit date required.
- Support selecting an existing place or creating one with map coordinates and hierarchy.
- Support photo selection, safe video files or approved video links, link validation, captions, alt text, ordering, and cover selection.
- Validate all input through the canonical schemas and write deterministic repository files.
- Add safe filenames, path traversal prevention, type/size/count limits, sanitization, autosave/recovery, and clear validation errors.
- Add tests proving the public build contains no authoring routes or write endpoints.

## Acceptance criteria

- The owner can create and preview a complete draft without hand-editing data files.
- Invalid or unsafe input cannot be saved.
- The studio is unreachable from the deployed public bundle.
- Reopening a saved draft preserves content and media ordering.

## Git checkpoint

Commit as `task(06): add secure local authoring studio` and push it.

## Completion evidence

- The loopback-only studio was exercised in the built-in browser from draft creation through media upload, safe preview, canonical save, reload, and a second save.
- Reopened drafts preserve visit date, rating, tags, tips, media metadata, ordering, and cover selection.
- Unit tests reject unsafe hosts, file signatures, paths, links, dates, coordinates, and raw HTML; the production-boundary scan rejects studio/API markers in `dist/`.
- `npm run verify`, `npm audit --audit-level=low`, and `git diff --check` pass.
