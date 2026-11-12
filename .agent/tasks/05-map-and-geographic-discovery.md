# Task 05 — Map and geographic discovery

Status: Complete locally (GitHub push pending repository creation)

Depends on: Tasks 02–04

## Objective

Implement the map-first discovery experience with an equivalent accessible list path.

## Actions

- Select documented, license-compatible map/GeoJSON sources and record attribution requirements.
- Implement world/country/region/locality/place navigation with Auckland as the first useful default.
- Style areas containing published experiences with strong editorial outlines and other areas with subdued grey outlines.
- Connect selected areas/places to cards and preserve context when switching between map and list views.
- Add keyboard-operable controls, non-color cues, screen-reader summaries, and list-view parity.
- Define safe fallback behavior when coordinates or map data are unavailable.

## Acceptance criteria

- Readers can move from Auckland/area to a place and its stories from map or list.
- Styling means `a published experience exists here`, not `everywhere in this area was explored`.
- Map attribution and data licenses are visible and compliant.
- Keyboard and list-only users can complete the same discovery path.

## Git checkpoint

Commit as `task(05): add accessible geographic discovery` and push it.

## Completion evidence

- Added a Leaflet/OpenStreetMap Auckland overview with visible attribution and documented licence/tile-use requirements.
- The editorial Auckland symbol explicitly means “area contains a published visit,” not that the whole area was explored; Sandy Beach remains “exact location pending.”
- Added World → New Zealand → Auckland navigation, keyboard-enabled map controls and marker, a screen-reader summary, legend, and equivalent place/story list.
- Eight Chromium tests pass, including discovery through the list and a forced OpenStreetMap tile-failure fallback.
- Built-in browser QA confirmed live tiles, attribution, compact responsive layout, list parity, and the activated Auckland popup link.
- The focused local Git commit is required before this task's version is recorded; remote backup remains blocked until the GitHub repository exists.
