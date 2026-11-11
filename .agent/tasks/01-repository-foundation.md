# Task 01 — Repository foundation

Status: Not started

Depends on: Task 00

## Objective

Create a minimal, maintainable, runnable project and establish recoverable Git/GitHub versioning.

## Actions

- Verify supported Node/npm versions and evaluate the preferred Astro + TypeScript direction against current official documentation.
- Scaffold only the public site and local authoring-studio boundaries needed by later tasks.
- Add formatting, linting, type checking, unit testing, and a basic browser smoke test.
- Add `.gitignore`, environment examples with placeholders only, and concise local commands.
- Initialize Git with an appropriate default branch.
- Establish an authenticated GitHub remote and push the planning/foundation version. If no authenticated route exists, preserve the local commit and record the exact blocker.
- Document the selected stack and any departure from the preferred direction in `DECISIONS.md`.

## Acceptance criteria

- A fresh install and development command work from documented steps.
- Build, lint, type check, unit test, and smoke test commands run successfully.
- Public and local-CMS code/output boundaries are explicit.
- No secrets or generated build output are tracked.
- Git history contains a focused foundation version; the remote push is verified or its concrete blocker is recorded.

## Git checkpoint

Commit as `task(01): establish repository foundation` and push it.
