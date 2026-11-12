# Task 07 — Sandy Beach story and media

Status: Complete

Depends on: Tasks 04–06

## Objective

Publish the first real story using the supplied Sandy Beach media and required copy.

## Actions

- Inventory and visually review all files in `blog_assets/sandy_beach/`; do not delete or overwrite originals.
- Verify the precise Sandy Beach location from trustworthy metadata or owner input. Do not guess.
- Convert selected HEIC photos to responsive web formats and prepare MOV videos/posters or safe embeds, retaining good quality and removing unnecessary public metadata.
- Create the place and dated story through the authoring workflow.
- Use author `Leonna Banzuela`, visit date `2026-11-01`, and the exact four-sentence copy in `PROJECT_CONTEXT.md`.
- Write honest captions/alt text based on visual inspection; omit unverified practical claims.
- Verify gallery, video, map/list card, direct URL, social preview, and mobile layout.

## Acceptance criteria

- The public site shows the Sandy Beach story with exactly four sentences, correct author, and correct visit date.
- Selected photos/videos load efficiently with captions/alt text and without exposing unnecessary original metadata.
- The place appears in Auckland map/list discovery after its location is verified.
- Original assets remain unchanged.

## Git checkpoint

Commit as `task(07): publish Sandy Beach story` and push it.

## Completion evidence

- All eight originals were inventoried, visually reviewed, hashed before processing, and confirmed unchanged afterward.
- Repeated photo metadata supports the rounded visit marker at `-36.9750, 174.6200`; no third-party reverse-geocoding service received the source coordinates.
- Two privacy-conscious photos and one short silent video were converted to responsive, metadata-free public derivatives with honest alt text and captions.
- The published direct route contains the exact four required sentences, Leonna Banzuela, 1 November 2026, responsive media, a cover/social image, and verified map/list discovery.
- The story was reopened and saved through the local studio; mobile, tablet, and desktop visual QA passed in the built-in browser.
- `npm run verify`, `npm audit --audit-level=low`, and `git diff --check` pass.
