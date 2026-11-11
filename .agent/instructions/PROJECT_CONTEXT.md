# Project context

## Product

Build a free-to-read, map-first travel journal that begins with Leonna Banzuela's experiences in Auckland and can later grow into a moderated multi-creator platform. The map is the discovery surface; personal stories, photos, videos, ratings, tips, links, and practical details are the substance.

## Verified visual and interaction direction

The shared ChatGPT roadmap was inspected in the in-app browser on 12 November 2026. Its verified direction is:

- Minimal, editorial design with warm paper tones, generous spacing, distinctive typography, and restrained sticky-note details.
- A compact header; do not repeat the oversized introductory block from the earlier mock-up. The map should appear quickly, especially on mobile.
- Hand-drawn-feeling geographic outlines. Areas with published experiences have a stronger outline; other areas are light grey and subdued.
- Progressive navigation: world/country -> region -> locality -> place, while allowing a creator to start at a small scope such as Auckland.
- A left-side country/region/story navigation on wide screens and a compact, accessible mobile alternative.
- Sticky-note place cards with place name, short introduction, and media preview.
- Full, directly shareable story pages with blog text, visit date, author, gallery, video, creator rating, tips, links, and map context.
- Filters update both the map and visible cards. Core groups include food and drink, study/work, setting, experience, climate, practical needs, and study facilities.
- `More at this place` shows other visits/stories tied to the same place. `More in this area` preserves the current geographic context and filters.
- Always provide a list view alongside map discovery for accessibility, search, and fast browsing.
- Responsive layouts for mobile, tablet, and desktop. No public login or signup page in the first release.

The shared chat described the prototype's features but did not expose the original interactive artifact as a downloadable or inspectable link. The requirements above and the final compact-header correction are verified; exact pixels are not. Task 00 records this limitation so later implementation uses the verified direction without pretending the unavailable artifact was visually measured.

## First story

- Place: Sandy Beach, Auckland, New Zealand
- Author: Leonna Banzuela
- Visit date: 1 November 2026 (`2026-11-01` in stored data)
- Source media: `blog_assets/sandy_beach/`
- Media present at planning time: five HEIC photos and three MOV videos.
- Do not guess precise coordinates; verify them from reliable metadata or ask the owner before publishing the map point.

The required four-sentence story copy is:

> Sandy Beach was a lovely place to slow down and enjoy the Auckland coast. The water looked so inviting that I really wanted to go for a swim. Unfortunately, I had not brought my swimsuit, so I could not get in. I still had a nice time taking in the view and would happily return better prepared.

## First-release scope

- Public, read-only Auckland travel site.
- Owner-only local authoring studio/CMS for creating and editing stories, selecting a place on a map, adding visit dates, photos, video or video links, external links, tags, ratings, and tips.
- Static or pre-rendered public pages with shareable URLs.
- GitHub is the version history and source of every release.
- Cloudflare Workers static assets is the intended initial host, following the evidence-backed Task 01 decision.

## Growth scope, not first-release scope

Creator accounts, public uploads, audience ratings, moderation, reporting, newsletters, direct video hosting, advertising, and the animated globe are later tasks. The data model must leave room for them without exposing unfinished controls.
