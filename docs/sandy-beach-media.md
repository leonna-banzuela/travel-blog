# Sandy Beach media record

## Source review

The five HEIC photos and three MOV videos in `blog_assets/sandy_beach/` were inventoried and visually reviewed on 12 November 2026. Originals remain unchanged and outside the public bundle.

Photo metadata clusters around `-36.9750, 174.6200` on 1 November 2026. The published marker rounds that repeated local evidence to four decimal places rather than exposing every original coordinate. No third-party reverse-geocoding service received the photo metadata.

## Public selection

- `IMG_0237.HEIC`: wide water view framed by a mature tree; selected as the cover.
- `IMG_0216.HEIC`: rocky shoreline, clear shallow water, and trees; selected for the gallery.
- `IMG_0214.MOV`: four-second vertical view from a canopy toward the lawn and beach; selected as a short supporting clip.

The longer video and people-focused photo frames were intentionally excluded to minimise identifiable-person exposure. The selected video is published without its original audio.

## Processing

Run `npm run media:sandy-beach` to reproduce the derivatives. The script verifies the SHA-256 hashes of every selected source before processing.

- Photos: 640/1280-pixel or 480/960-pixel AVIF and WebP variants.
- Video: 720-pixel-wide H.264 MP4 with fast-start and no audio, plus a WebP poster.
- Metadata: Sharp and FFmpeg create new derivatives without carrying GPS, camera, creation-time, or other source metadata into public files.
- Originals: the processing script reads but never overwrites or deletes source files.
