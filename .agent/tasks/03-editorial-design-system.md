# Task 03 — Editorial design system

Status: Complete locally (GitHub push pending repository creation)

Depends on: Tasks 01–02

## Objective

Create the simple editorial visual system and responsive shell without letting decoration obscure the map or stories.

## Actions

- Define tokens for warm paper surfaces, ink/grey map lines, limited accent colors, typography, spacing, borders, shadows, and motion.
- Build the compact header, wide-screen side navigation, mobile navigation, control bar, content container, buttons, chips, cards, and empty/error/loading states.
- Create the sticky-note card treatment with restrained rotation and no readability loss.
- Respect reduced motion, high contrast, 200% zoom, touch targets, keyboard focus, and long content.
- Build a small component preview route or equivalent visual test surface.
- Check representative mobile, tablet, and desktop viewports.

## Acceptance criteria

- The map/content begins near the top rather than below a large hero.
- Components are visually consistent and meet contrast/focus requirements.
- No layout overflow occurs at agreed viewport sizes or 200% text zoom.
- Visual snapshots or screenshots are recorded for the three viewport classes.

## Git checkpoint

Commit as `task(03): build editorial design system` and push it.

## Completion evidence

- Added reusable compact header, wide-screen side navigation, discovery controls, buttons, chips, story cards, sticky notes, and empty/error/loading states.
- Added `/design-system` as a static component preview and documented the design tokens and accessibility rules.
- Playwright verified the 320-pixel viewport and simulated 200% root text sizing without horizontal page overflow.
- Built-in browser QA confirmed the desktop side rail, map-first hierarchy, component preview, and visible keyboard focus.
- Recorded full-page screenshots at 390 × 844, 768 × 1024, and 1440 × 1000 under `docs/screenshots/`.
- Focused local version: commit `a5e420f` (`task(03): build editorial design system`). Remote backup remains blocked until the GitHub repository exists.
