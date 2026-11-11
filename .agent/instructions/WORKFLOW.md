# Execution workflow

## Source of truth

- Product rules and constraints: `.agent/instructions/`
- Ordered work: `.agent/tasks/PLAN.md` and the numbered task files
- Observed state: `.agent/progress/STATUS.md`
- Durable choices: `.agent/progress/DECISIONS.md`
- Actual implementation and verification: the repository, test output, rendered site, Git history, and deployed site

## Task selection

Use the `Next task` field in `STATUS.md`. If that task is blocked, record the blocker and select only another task whose dependencies are complete. Do not silently pull later scope into the current task.

## Progress updates

Update `STATUS.md` at every meaningful stopping point. For the selected task, record:

- status: `Not started`, `In progress`, `Blocked`, or `Complete`;
- date and short note;
- files or components changed;
- commands and checks actually run;
- visual QA performed;
- commit hash and GitHub link when available;
- remaining work or blocker.

Record architectural or product choices in `DECISIONS.md` with date, decision, rationale, and consequences. Plans are not evidence of completed implementation.

## Definition of done for one task

A task is complete only when every acceptance criterion in its file is backed by current evidence, relevant tests pass, user-facing work has been visually checked, progress is updated, and a recoverable Git version exists. A push failure does not erase completed local work, but it must be recorded and retried before the next release is called backed up on GitHub.
