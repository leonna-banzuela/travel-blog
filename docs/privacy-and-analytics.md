# Privacy and analytics

## Active collection

The public site uses Cloudflare Web Analytics through the manually installed beacon in `BaseLayout.astro`. The site token is intentionally public because it is delivered in the page source; it is not an API credential and cannot administer the Cloudflare account.

Cloudflare documents the collected Web Analytics dimensions as country, host, path, referring site, device type, browser, operating system, and navigation type. The beacon also reports navigation timing and Core Web Vitals. Cloudflare states that it does not track individual people across customer sites, does not log query strings, and does not support custom events. The current retention statement is seven days of unsampled beacon data followed by longer-term aggregation, with up to six months visible in the dashboard.

Sources checked 14 November 2026:

- <https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/>
- <https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/>
- <https://developers.cloudflare.com/web-analytics/faq/>

## Site-owned browser data

Saved place IDs remain in browser local storage under the journal’s origin. There are no reader accounts, advertising pixels, cloud saved-place profiles, newsletter forms, or public mutation endpoints.

## Change control

Any new analytics vendor, custom event, advertising technology, account system, or public submission flow requires a privacy review, matching public copy, CSP changes, and tests before release.
