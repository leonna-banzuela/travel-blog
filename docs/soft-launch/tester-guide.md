# Soft-launch tester guide

## Audience

Recruit 5–10 people who did not build the site. Aim for a mix of phone, tablet, desktop, keyboard-only, zoomed-text, and screen-reader use. Do not collect names in the repository; assign tester IDs `T01`–`T10`.

## Session script

Give each tester the live home URL and ask them to think aloud while completing these tasks without hints:

1. Find a beach story from the home page.
2. Open the Sandy Beach story and state who wrote it and when the visit happened.
3. Use at least two filters, then clear them.
4. Switch between map and list paths and return to the story without losing context.
5. Find the practical tip about swimming.
6. Copy or use the share control for the direct story URL.
7. Explain what the site saves or measures after reading the privacy page.

Record device/browser, completion outcome, observed route, hesitation or error, exact words where useful, severity, and whether a retest passed. Do not record passwords, precise addresses, health information, or other unrelated personal details.

## Severity

- `S1 blocker`: cannot complete a core task, data loss, security/privacy failure, or severe accessibility barrier.
- `S2 high`: core task can be completed only with substantial help or a broken alternative path.
- `S3 medium`: confusing or inefficient but recoverable without help.
- `S4 low`: polish or preference that does not block the task.

High-severity findings must be fixed and retested before Task 11 can be marked complete.
