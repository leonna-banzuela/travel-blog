import { expect, test } from "@playwright/test";

test("story exposes complete social and structured metadata", async ({
  page,
}) => {
  await page.goto("/stories/sandy-beach-2026-11-01-leonna-banzuela");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index, follow",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "/stories/sandy-beach-2026-11-01-leonna-banzuela",
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    /A nice day at Sandy Beach/,
  );
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const structuredData = JSON.parse(jsonLd ?? "null");
  expect(structuredData).toMatchObject({
    "@type": "BlogPosting",
    headline: "A nice day at Sandy Beach",
    author: { "@type": "Person", name: "Leonna Banzuela" },
    contentLocation: { "@type": "Place", name: "Sandy Beach" },
  });
});

test("crawler endpoints publish discoverable routes and a feed", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  await expect(sitemap.text()).resolves.toContain(
    "/stories/sandy-beach-2026-11-01-leonna-banzuela",
  );
  await expect(sitemap.text()).resolves.toContain("/privacy");

  const robots = await request.get("/robots.txt");
  await expect(robots.text()).resolves.toContain("Sitemap:");

  const feed = await request.get("/feed.xml");
  expect(feed.headers()["content-type"]).toMatch(
    /(?:application\/atom\+xml|text\/xml)/,
  );
  await expect(feed.text()).resolves.toContain("A nice day at Sandy Beach");
});

test("privacy copy and privacy-first analytics match the public build", async ({
  page,
}) => {
  await page.goto("/privacy");

  await expect(
    page.getByRole("heading", { name: "Privacy, in plain language" }),
  ).toBeVisible();
  await expect(
    page.getByText("Cloudflare Web Analytics", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(/does not use advertising trackers/i),
  ).toBeVisible();
  await expect(
    page.locator(
      'script[src="https://static.cloudflareinsights.com/beacon.min.js"]',
    ),
  ).toHaveAttribute("data-cf-beacon", /"token"/);
});

test("non-content utility and missing pages are not indexed", async ({
  page,
}) => {
  await page.goto("/design-system");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );

  await page.goto("/missing-page");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
});
