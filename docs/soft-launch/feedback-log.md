# Soft-launch feedback log

One independent tester session has been reported. Automated checks and owner QA do not count toward the five-session minimum.

| Tester | Device / access mode  | Status                              | Core tasks completed | Findings    | Retest  |
| ------ | --------------------- | ----------------------------------- | -------------------- | ----------- | ------- |
| T01    | Windows 11 LOQ / Edge | Observed; fixes verified internally | Yes                  | F-001–F-005 | Pending |
| T02    | —                     | Awaiting tester                     | —                    | —           | —       |
| T03    | —                     | Awaiting tester                     | —                    | —           | —       |
| T04    | —                     | Awaiting tester                     | —                    | —           | —       |
| T05    | —                     | Awaiting tester                     | —                    | —           | —       |
| T06    | —                     | Awaiting tester                     | —                    | —           | —       |
| T07    | —                     | Awaiting tester                     | —                    | —           | —       |
| T08    | —                     | Awaiting tester                     | —                    | —           | —       |
| T09    | —                     | Awaiting tester                     | —                    | —           | —       |
| T10    | —                     | Awaiting tester                     | —                    | —           | —       |

## Finding template

### F-000 — Short observed title

- Tester:
- Date:
- Device/browser/access mode:
- Task:
- Observed behavior:
- Expected behavior:
- Severity:
- Evidence:
- Resolution commit/PR:
- Retest evidence:

## Observed findings

### F-001 — Filters require too many controls and too much space

- Tester: T01
- Date: 15 November 2026
- Device/browser/access mode: Windows 11 LOQ computer / Microsoft Edge / pointer and keyboard mode not reported
- Task: Apply and clear at least two filters.
- Observed behavior: The tester completed the task but hesitated at “More filters” because the drawer contained too many selects and actions. They requested one compact filter control with all important choices visible after the first click and suggested limiting the groups to setting, practicality, and experience.
- Expected behavior: The core filters should be understandable after one click and should not push the map and stories far down the page, especially on mobile.
- Severity: S3 medium
- Evidence: Owner-provided observation from the T01 session.
- Resolution commit/PR: PR #7, merged as `aa26f7c`; production run `43646551520` passed.
- Retest evidence: Pending independent retest.

### F-002 — Desktop story media overwhelms the writing

- Tester: T01
- Date: 15 November 2026
- Device/browser/access mode: Windows 11 LOQ computer / Microsoft Edge
- Task: Read the Sandy Beach story and find its swimming tip.
- Observed behavior: The tester found the images too large on desktop and noticed excessive whitespace between the media and blog copy. They preferred alternating story passages and media.
- Expected behavior: Photography and writing should share the visual hierarchy and maintain a comfortable reading rhythm.
- Severity: S3 medium
- Evidence: Owner-provided observation from the T01 session.
- Resolution commit/PR: PR #7, merged as `aa26f7c`; production run `43646551520` passed.
- Retest evidence: Pending independent retest.

### F-003 — Story actions have inconsistent hierarchy and sizing

- Tester: T01
- Date: 15 November 2026
- Device/browser/access mode: Windows 11 LOQ computer / Microsoft Edge
- Task: Share the direct story URL and explore related location pages.
- Observed behavior: Share, copy, related-location, and save actions appeared as differently sized buttons in one row. The tester requested compact icons for share, copy, and save, with the two related-location links beside the place and area context above the story title.
- Expected behavior: Utility actions should have consistent sizing while contextual navigation should appear with the location context.
- Severity: S3 medium
- Evidence: Owner-provided observation from the T01 session.
- Resolution commit/PR: PR #7, merged as `aa26f7c`; production run `43646551520` passed.
- Retest evidence: Pending independent retest.

### F-004 — Landing page delays the map and repeats navigation

- Tester: T01
- Date: 15 November 2026
- Device/browser/access mode: Windows 11 LOQ computer / Microsoft Edge
- Task: Find a beach story from the home page and switch between map and list paths.
- Observed behavior: The tester found the desktop side rail duplicative of the header and felt the introductory headline and copy delayed substantial content. On mobile, the search controls occupied too much vertical space before the map and stories.
- Expected behavior: The landing page should lead with a compact search/filter row and the map, without duplicate primary navigation.
- Severity: S3 medium
- Evidence: Owner-provided observation from the T01 session.
- Resolution commit/PR: PR #7, merged as `aa26f7c`; production run `43646551520` passed.
- Retest evidence: Pending independent retest.

### F-005 — Landing map scope feels too narrow

- Tester: T01
- Date: 15 November 2026
- Device/browser/access mode: Windows 11 LOQ computer / Microsoft Edge
- Task: Use the landing map.
- Observed behavior: The tester expected to begin from a wider world, country, or region view and described a future sparkling 3D globe.
- Expected behavior: The initial map should make geographic scale clear and provide direct world, New Zealand, and Auckland scope controls. The animated globe remains the explicitly deferred Task 14 growth feature.
- Severity: S4 low
- Evidence: Owner-provided observation from the T01 session and the recorded implementation plan.
- Resolution commit/PR: PR #7, merged as `aa26f7c`; production run `43646551520` passed. The 3D globe remains deferred.
- Retest evidence: Pending independent retest.
