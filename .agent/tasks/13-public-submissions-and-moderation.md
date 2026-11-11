# Task 13 — Public submissions and moderation

Status: Not started (later phase)

Depends on: Successful Task 12 pilot and explicit owner approval

## Objective

Open contributions only after robust identity, authorization, moderation, abuse, and recovery controls exist.

## Actions

- Add verified accounts, secure sessions, creator roles, record-level authorization, and account controls.
- Add drafts, previews, submission status, moderation queues, revision requests, reporting, removal, and appeal/response processes.
- Enforce photo/video type, size, count, compression, storage, and rate quotas before accepting uploads.
- Add audit logs, abuse prevention, backups, restoration drills, data retention, privacy controls, and terms.
- Keep creator ratings separate from community ratings and show rating counts.
- Threat-model and penetration-test the mutation/upload paths before launch.

## Acceptance criteria

- Authorization tests prove users cannot read or alter another creator's private content.
- Upload abuse, unsafe content, and quota failures are handled safely.
- Moderation, reporting, deletion, backup, and restore flows are tested end to end.
- Public registration remains disabled until every launch gate passes.

## Git checkpoint

Commit as `task(13): add moderated public submissions` and push/tag it only after security review.
