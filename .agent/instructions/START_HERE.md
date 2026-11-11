# Start here

## Required read order

1. Read every Markdown file in `.agent/instructions/`.
2. Read `.agent/progress/STATUS.md` and `.agent/progress/DECISIONS.md`.
3. Read `.agent/tasks/PLAN.md`.
4. Find the `Next task` named in `STATUS.md`, then read that task file completely.
5. Inspect the repository files and Git state relevant to that task before editing.

## Resume rule

Continue from recorded evidence; do not redo completed tasks. If `STATUS.md` conflicts with the repository, tests, or Git history, treat the repository and observed verification as authoritative and correct `STATUS.md`. Work on the next task whose dependencies are complete and which is not blocked.

## Per-task loop

1. Restate the task objective and acceptance criteria.
2. Perform a read-only preflight and record assumptions or unresolved choices.
3. Implement only the selected task.
4. Run the task's focused verification and any relevant broader checks.
5. Visually inspect user-facing changes at mobile, tablet, and desktop sizes.
6. Update `progress/STATUS.md` and `progress/DECISIONS.md` with observed evidence.
7. Commit the task as a distinct version and push it to GitHub when the remote is configured.
8. Set `Next task` to the next unblocked task and continue.

Never claim a check passed unless it was actually run. Preserve useful existing work and unrelated user changes.
