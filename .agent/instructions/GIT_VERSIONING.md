# Git and GitHub versioning

## Version rule

Every numbered task is a recoverable version. Do not combine several tasks into one opaque commit.

For each task:

1. Start from a clean or understood working tree.
2. Use a short branch such as `task/01-repository-foundation` when a remote workflow exists.
3. Make focused commits; at minimum create one final task commit using `task(NN): concise outcome`.
4. Update `.agent/progress/STATUS.md` before the final task commit.
5. Push the branch/commit to GitHub and record its URL or hash in `STATUS.md`.
6. Tag public milestones (`v0.1.0`, `v0.2.0`, and so on) only after the deployed result is verified.

Never force-push shared history, commit secrets, or bypass failed required checks. Do not claim a version is on GitHub until the remote confirms it. Task 00 initialized the local Git repository, but no `gh` command is installed and the built-in browser currently reaches a GitHub sign-in page. Task 01 must establish the remote after an authenticated route is available.
