# Internal soft-launch QA

Date: 14 November 2026  
Environment: live Cloudflare Workers release, Chromium in the built-in browser  
Role: build-team verification, not an external tester session

## Observed checks

| Area             | Observed behavior                                                                                                                                                                           | Result |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Home discovery   | The live accessibility tree exposed the compact primary navigation, search controls, map/list choices, geographic links, Sandy Beach list entry, and latest story link in a coherent order. | Pass   |
| Combined filters | Selecting `setting=beach` and `experience=relaxing` produced a shareable query URL and retained the single matching Sandy Beach story. Clear removed the filters.                           | Pass   |
| Keyboard order   | At the mobile viewport, the first ten Tab stops were skip link, brand/home, Stories, Map, Privacy, Search, Sort, Apply, Clear, and More filters.                                            | Pass   |
| Text zoom        | After browser zoom was increased to the 200% class, the live mobile controls remained readable, visibly focused, and free of horizontal overflow.                                           | Pass   |
| Map/list parity  | The map region and accessible list exposed the same Sandy Beach place and story routes, with OpenStreetMap attribution present.                                                             | Pass   |
| Direct story     | The direct URL displayed the title, Leonna Banzuela, 1 November 2026, exact four-sentence story, swimsuit tip, gallery, and share/copy controls.                                            | Pass   |
| Media behavior   | The live video exposed controls and did not autoplay.                                                                                                                                       | Pass   |
| Share metadata   | The canonical URL matched the clean direct story URL without discovery parameters.                                                                                                          | Pass   |
| Browser console  | No warning or error entries were observed on the live direct story page.                                                                                                                    | Pass   |

## Findings

No release-blocking defect was observed in this internal pass. This evidence does not replace the five to ten independent sessions required by Task 11; unfamiliar readers may reveal comprehension and navigation problems that build-team checks cannot.

## T01 remediation QA — 15 November 2026

Environment: local production build, Chromium screenshots plus Chromium/Firefox/WebKit automation

Role: build-team verification, not an independent retest

| Area               | Observed behavior                                                                                                                                                         | Result |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Compact discovery  | At 390×844, search, filter, and clear controls fit in one row; the collapsed form remained under 100 pixels high and the map followed immediately.                        | Pass   |
| Reduced filters    | One click exposed only Setting, Practicality, Experience, Sort, saved-only, and copy-link controls. Search and select changes applied without an Apply button.            | Pass   |
| Landing hierarchy  | The duplicate rail and long introduction were absent. Home screenshots at 390×844 and 1440×1000 led with search and a visible map/story path.                             | Pass   |
| Map scope          | World, New Zealand, and Auckland controls changed the Leaflet scope; New Zealand was the default country view.                                                            | Pass   |
| Story rhythm       | At 768×900 and 1440×1000, the four exact sentences alternated with two photos and the short video instead of appearing as a separate block below an oversized gallery.    | Pass   |
| Story actions      | Share, copy, and save rendered as three equal circular icon controls with accessible names. Related-location links appeared beside the Sandy Beach/Auckland context.      | Pass   |
| Automated coverage | The complete verification chain passed 27 unit tests and 69 browser checks across Chromium, Firefox, and WebKit, including axe scans and the new T01 regression coverage. | Pass   |

The fixes are ready for an independent retest. This internal QA does not change T01's `Pending` retest status.
