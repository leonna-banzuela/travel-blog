# Task 09 — Production hardening

Status: Not started

Depends on: Tasks 03–08

## Objective

Make the first release accessible, secure, searchable, fast, privacy-conscious, and recoverable.

## Actions

- Run automated and manual accessibility checks across map, list, story, and CMS flows.
- Add page titles, descriptions, canonical URLs, social cards, structured data, sitemap, robots policy, and feed if appropriate.
- Set performance budgets and optimize fonts, images, video, JavaScript, caching, and layout stability.
- Add security headers/CSP, dependency scanning, input/rendering tests, and a secret scan.
- Add error boundaries, useful not-found/offline states where appropriate, logging that avoids sensitive data, and backup/restore instructions for content.
- Verify on representative Chromium, Firefox, WebKit, mobile, tablet, and desktop conditions.

## Acceptance criteria

- No critical accessibility or security findings remain open.
- Core pages meet recorded performance budgets on a production build.
- Social, SEO, direct-link, broken-link, and structured-data checks pass.
- Content can be restored from Git and source assets using documented steps.

## Git checkpoint

Commit as `task(09): harden first release` and push it.
