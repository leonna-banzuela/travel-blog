# Task 08 — Filters, search, related content, and sharing

Status: Not started

Depends on: Tasks 05 and 07

## Objective

Make real content easy to find and share without overwhelming the interface.

## Actions

- Add combinable controlled filters for category, setting, experience, climate, practical needs, and facilities.
- Add search and useful sorting; keep map markers/areas and list cards synchronized.
- Preserve filter context across `More at this place` and `More in this area`.
- Implement `More at this place` from shared place IDs and `More in this area` from geographic relations.
- Add local-only saved places with clear privacy behavior and no account requirement.
- Add copy/share controls with canonical URLs and graceful fallback.
- Test empty results, URL state, keyboard operation, and direct shared links.

## Acceptance criteria

- Combined filters produce predictable, URL-shareable results.
- Related-content buttons use relationships rather than text-name guesses.
- Saved places work without collecting personal data or implying cloud sync.
- Search/filter controls remain compact and usable on mobile.

## Git checkpoint

Commit as `task(08): add discovery and sharing tools` and push it.
