# Task 10 — GitHub CI and deployment

Status: In progress — CI, preview/production deployment, and rollback are verified; branch protection and milestone tagging remain

Depends on: Task 09

## Objective

Make every version reproducible on GitHub and deploy a verified public first release.

## Actions

- Confirm the repository and all task commits are present on GitHub with no secrets or oversized originals accidentally tracked.
- Add protected CI for install, format/lint, type check, tests, build, link checks, and security checks.
- Configure Cloudflare Workers static assets from the GitHub repository with preview deployments and production branch rules.
- Add required environment values through the host's secret controls, never the repository.
- Verify deployment headers, routes, assets, map attribution, direct links, social previews, and rollback to a prior version.
- Tag the verified public milestone and record repository/deployment URLs in `STATUS.md`.

## Acceptance criteria

- A clean GitHub checkout produces the same successful build.
- Pull requests/branches receive CI results and preview deployments.
- The public URL works on mobile and desktop, including direct story links.
- A rollback drill restores the previous known-good version.

## Git checkpoint

Commit as `task(10): automate and deploy first release`, push it, and tag the verified milestone.
