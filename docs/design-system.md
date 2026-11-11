# Editorial design system

The public journal uses warm paper surfaces, dark ink, pale map lines, and three restrained accents: terracotta for editorial emphasis, sea blue for focus and map cues, and yellow for handwritten notes. Georgia provides the editorial voice while the system UI stack keeps controls compact and legible without downloading third-party fonts.

## Layout and components

- The sticky header is 64 pixels tall on larger screens and becomes a two-row touch-friendly header on small screens.
- A side rail appears only when the viewport can support it; mobile and tablet navigation stays in the header.
- The short introduction, discovery controls, and map begin near the top of the page.
- Shared styles cover search, buttons, filter chips, story cards, status and tag pills, sticky notes, and empty, error, and loading states.
- Sticky notes use at most `0.65deg` rotation and return to zero rotation on small screens.

The live component preview is available at `/design-system` during local development and in the static build.

## Accessibility rules

- Interactive controls have a minimum height of 44 pixels.
- Keyboard focus uses a high-visibility sea-blue outline with spacing from the focused element.
- Reduced-motion preferences disable smooth scrolling and collapse animations to a single near-instant frame.
- Forced-colour mode replaces decorative surfaces with system canvas and text colours.
- Layout checks cover a 320-pixel viewport and simulated 200% root text sizing without horizontal page overflow.

## Visual records

- [Mobile, 390 × 844](./screenshots/task-03-mobile.png)
- [Tablet, 768 × 1024](./screenshots/task-03-tablet.png)
- [Desktop, 1440 × 1000](./screenshots/task-03-desktop.png)

The screenshots use placeholders only. Original Sandy Beach photography remains reserved for the dedicated media and first-story task.
