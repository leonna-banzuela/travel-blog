# Task 04 — Public reading experience

Status: Complete locally (GitHub push pending repository creation)

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

## Completion evidence

- Added static story list/detail, place, area, creator, and 404 routes backed by the validated catalog.
- Published the supplied four-sentence Sandy Beach story seed with author and visit date; coordinates and original media remain unset for Task 07.
- Story pages render visit date, attribution, rating, tips, safe optional media/links, sharing, connected navigation, and a labelled unloaded future sponsor position.
- Empty optional media and external-link arrays omit their headings and spacing.
- Six Chromium tests cover discovery, direct story metadata, connected reading routes, not-found handling, small-screen overflow, and 200% text reflow.
- Built-in browser QA confirmed the live Sandy Beach story at the compact viewport.
- The focused local Git commit is required before this task's version is recorded; remote backup remains blocked until the GitHub repository exists.
