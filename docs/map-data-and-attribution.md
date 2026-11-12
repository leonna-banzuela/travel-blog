# Map data and attribution

## Selected sources

- **Map library:** Leaflet `1.9.4`, distributed under the BSD 2-Clause licence. The package retains its licence in the locked dependency tree. [Leaflet repository and licence](https://github.com/Leaflet/Leaflet)
- **Basemap tiles:** OpenStreetMap Standard raster tiles from the required `https://tile.openstreetmap.org/{z}/{x}/{y}.png` endpoint. [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
- **Map data attribution:** `© OpenStreetMap contributors`, linked to the copyright and licence page in both Leaflet's on-map attribution control and the adjacent map help text. [OpenStreetMap copyright and licence](https://www.openstreetmap.org/copyright)

No separate GeoJSON boundary dataset is bundled in this version. The map uses the OpenStreetMap basemap plus an editorial area-level symbol centered on the Auckland overview. That symbol means only “this area contains a published visit”; it is not an Auckland boundary and does not claim the whole region was explored.

## Usage constraints

- Request only tiles visible in the reader's current interactive viewport; never prefetch, bulk-download, or offer offline tile packs.
- Keep the exact OpenStreetMap tile URL configurable in one component and preserve normal browser caching and referrer behaviour.
- Keep visible attribution on the map and in adjacent text; do not place controls over it.
- The community tile service is best-effort and may withdraw access. Reassess the provider before commercial growth or meaningful traffic.
- Do not send private content to the tile service. The map currently sends only ordinary tile coordinates for the public Auckland overview.

## Accessibility and fallback

- Leaflet keyboard navigation and zoom controls are enabled, and the area symbol has a descriptive keyboard label.
- A geographic breadcrumb and an always-visible list provide the same area, place, and story routes without interacting with the map.
- The screen-reader summary explains the number of published visits and the missing exact place coordinates.
- If JavaScript or tiles fail, the list and all public routes remain usable. Sandy Beach deliberately has no place marker until its coordinates are verified.
