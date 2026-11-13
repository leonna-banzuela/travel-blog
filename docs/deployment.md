# GitHub and Cloudflare deployment

## Required repository setup

Create an empty private or public repository under `leonna-banzuela`, add it as `origin`, and push `main`. Protect `main`: require the `Verify clean checkout` result, require a pull request, block force pushes and deletion, and require resolved review conversations. Do not upload `blog_assets/`; Git confirms only processed `public/media/` derivatives are tracked.

Create GitHub `preview` and `production` environments. Put `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in environment secrets, and put the final HTTPS origin in the `SITE_URL` environment variable. The verified deployment token is restricted to Workers Scripts edit for the target account and expires after one year. Never put these values in repository files, workflow text, issue comments, or build logs.

The release workflow uses a locked install, all three browser engines, the complete verification chain, a Wrangler dry run, pull-request Workers Preview deployments, and production deployment only after verification on `main`. Forked pull requests do not receive deployment secrets.

## First deployment verification

After the workflow reports a production URL, verify:

1. `/`, `/stories`, the Sandy Beach direct story URL, `/sitemap.xml`, `/robots.txt`, and `/feed.xml` return successfully over HTTPS.
2. The deployed HTML uses the exact production origin in canonical, Open Graph, structured-data, sitemap, and feed URLs.
3. Response headers contain the CSP, frame/object restrictions, permissions policy, MIME protection, and expected cache rules from `public/_headers`.
4. The map loads with visible OpenStreetMap attribution, while blocking tiles still leaves the place list usable.
5. Mobile and desktop layouts, photos, silent video, copied canonical links, and unknown-route 404 behavior match the verified local build.
6. No owner studio file, local recovery data, original HEIC/MOV, secret, or public write route exists in the deployment.

## Rollback drill

Use Cloudflare Workers Deployments to redeploy the immediately previous successful version, check the home and direct Sandy Beach story routes, then redeploy the current verified version and repeat the checks. Record both deployment IDs and URLs in `.agent/progress/STATUS.md`. Do not force-push or delete the failed commit; fix forward in a new commit.

Only after production and rollback are observed should the repository receive the first public milestone tag.
