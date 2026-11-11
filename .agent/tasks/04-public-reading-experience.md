# Task 04 — Public reading experience

Status: Not started

Depends on: Tasks 02–03

## Objective

Build the fast, shareable reading experience before adding complex map controls.

## Actions

- Build the home/list experience, place-card collection, story detail page, place page, area page, and Leonna's creator profile.
- Render story date as `Visited on`, author attribution, gallery, video/embed area, rating, tips, practical information, and safe external links.
- Add direct-route handling, not-found states, and clear navigation back to the current area/list.
- Reserve labelled, unobtrusive future ad positions without loading ads.
- Add component and browser tests for the core reading path.

## Acceptance criteria

- A reader can discover, open, read, and share a story without using the map.
- Direct story URLs render the full page and correct metadata.
- Repeat visits to one place remain distinct and show their own visit dates.
- Empty optional sections do not leave broken headings or spacing.

## Git checkpoint

Commit as `task(04): implement public reading experience` and push it.
