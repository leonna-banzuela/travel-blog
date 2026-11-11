# Travel Blog repository instructions

Before doing any work in this repository, read these files in order:

1. `.agent/instructions/START_HERE.md`
2. `.agent/instructions/PROJECT_CONTEXT.md`
3. `.agent/instructions/WORKFLOW.md`
4. `.agent/instructions/QUALITY_SECURITY.md`
5. `.agent/instructions/GIT_VERSIONING.md`
6. `.agent/progress/STATUS.md`
7. `.agent/progress/DECISIONS.md`
8. `.agent/tasks/PLAN.md`
9. The task file named as `Next task` in `.agent/progress/STATUS.md`

Treat the live repository, tests, and rendered output as the source of truth. Work on one task at a time. When a task is complete, verify it, update the progress files with observed evidence, commit the task as a distinct version, push it to GitHub when a remote is configured, and then continue with the next unblocked task.

Do not expose secrets, add a public mutation endpoint, or create public login/signup screens during the first release. Do not mark work complete based only on intent or a task description.
