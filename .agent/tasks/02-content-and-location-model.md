# Task 02 — Content and location model

Status: Complete locally (GitHub push pending repository creation)

Depends on: Task 01

## Objective

Define validated content that supports repeated visits, multiple creators, map discovery, and safe rendering.

## Actions

- Create separate schemas for `Place`, `Story/Visit`, `Author`, `Media`, geographic areas, and controlled tags.
- Make `visitDate` required for every story and allow several stories at the same place, including the same author on different dates.
- Define stable IDs and shareable slugs that do not collide on repeat visits.
- Include author rating, practical tips, external links, media captions/alt text, coordinates, geographic hierarchy, publication status, and update timestamps.
- Define controlled filter groups from the verified roadmap.
- Add fixtures for repeated visits and multiple authors at one place.
- Add schema validation and tests for invalid dates, URLs, coordinates, unsafe content, duplicate IDs, and missing relations.

## Acceptance criteria

- Invalid content fails with clear, actionable messages.
- Tests prove one place can have several independently dated stories.
- Stories can be resolved by place, area, author, date, and tags.
- Schema documentation distinguishes observed facts from subjective creator notes.

## Git checkpoint

Commit as `task(02): add validated travel content model` and push it.

## Completion evidence

- Added strict Zod schemas for places, dated stories/visits, authors, media, geographic areas, and controlled tag groups.
- Added catalog-level checks for duplicate identities, missing relationships, and geographic cycles.
- Added repeated-visit and multiple-author fixtures plus filtering by place, area, author, date, and tags.
- `npm run verify` passed 14 unit tests, the static production build, and the Chromium smoke test.
- `npm audit --audit-level=low` reported 0 vulnerabilities.
- Focused local version: commit `4870169` (`task(02): add validated travel content model`). Remote backup remains blocked until the GitHub repository exists.
