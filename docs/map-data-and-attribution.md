# Map data and attribution

## Selected sources

- **Map library:** Leaflet `1.9.4`, distributed under the BSD 2-Clause licence. The package retains its licence in the locked dependency tree. [Leaflet repository and licence](https://github.com/Leaflet/Leaflet)
- **Basemap tiles:** OpenStreetMap Standard raster tiles from the required `https://tile.openstreetmap.org/{z}/{x}/{y}.png` endpoint. [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
- **Map data attribution:** `© OpenStreetMap contributors`, linked to the copyright and licence page in both Leaflet's on-map attribution control and the adjacent map help text. [OpenStreetMap copyright and licence](https://www.openstreetmap.org/copyright)
- **Globe land geometry:** Natural Earth 1:110m land data, distributed through the `world-atlas` package. Natural Earth data is public domain. The checked-in GeoJSON is generated with `npm run globe:data`; it contains land geometry only and makes no political-boundary claim. [Natural Earth terms of use](https://www.naturalearthdata.com/about/terms-of-use/)

The landing globe uses the bundled low-resolution land geometry and the story catalog's verified visit coordinates. Detailed place pages can still use the OpenStreetMap basemap. Neither rendering represents an administrative boundary or claims that an entire region was explored.

## Usage constraints

- Request only tiles visible in the reader's current interactive viewport; never prefetch, bulk-download, or offer offline tile packs.
- Keep the exact OpenStreetMap tile URL configurable in one component and preserve normal browser caching and referrer behaviour.
- Keep visible attribution on the map and in adjacent text; do not place controls over it.
- The community tile service is best-effort and may withdraw access. Reassess the provider before commercial growth or meaningful traffic.
- Do not send private content to the tile service. The map currently sends only ordinary tile coordinates for the public Auckland overview.
- Keep the globe geometry local. The landing page must not contact a third-party globe, map, or tracking service to render it.

## Accessibility and fallback

- The globe can be rotated by pointer or arrow keys and has a descriptive region label.
- A persistent location link and the latest-story section provide the same story route without interacting with the globe.
- The screen-reader status announces when the globe is ready or when its geometry cannot load.
- If JavaScript, globe data, or tiles fail, the story link and all public routes remain usable.
