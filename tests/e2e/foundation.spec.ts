import { expect, test } from "@playwright/test";

test("renders the read-only travel journal foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Travel stories by Leonna Banzuela");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Every place holds a dated story.",
  );
  await expect(
    page.getByRole("heading", { name: "Explore Auckland" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /travel journal home/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /log in|sign up/i })).toHaveCount(
    0,
  );
});

test("design system is usable without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/design-system");

  await expect(
    page.getByRole("heading", { name: "Paper, ink, and useful details." }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("wrong turn");

  const layout = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(layout.bodyWidth).toBeLessThanOrEqual(layout.viewportWidth);
});

test("layout reflows at 200 percent text zoom", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  const layout = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(layout.bodyWidth).toBeLessThanOrEqual(layout.viewportWidth);
  await expect(
    page.getByRole("heading", { name: "Explore Auckland" }),
  ).toBeVisible();
});

test("reader can discover and open the Sandy Beach story", async ({ page }) => {
  await page.goto("/stories");
  await page.getByRole("link", { name: /A nice day at Sandy Beach/i }).click();

  await expect(page).toHaveURL(
    /\/stories\/sandy-beach-2026-11-01-leonna-banzuela\/?$/,
  );
  await expect(
    page.getByRole("heading", { level: 1, name: "A nice day at Sandy Beach" }),
  ).toBeVisible();
  await expect(page.getByText("Visited on")).toBeVisible();
  await expect(page.getByText("1 November 2026")).toBeVisible();
  await expect(page.getByRole("button", { name: "Share story" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Photos and videos" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /broad-canopied tree/i }),
  ).toBeVisible();
  await expect(page.locator("video")).toHaveAttribute("preload", "metadata");
  await expect(page.locator("video")).not.toHaveAttribute("autoplay", "");
  await expect(page.locator('source[type="image/avif"]')).toHaveCount(2);
  await expect(page.getByRole("heading", { name: "Useful links" })).toHaveCount(
    0,
  );
});

test("direct story route has metadata and connected reading pages", async ({
  page,
}) => {
  await page.goto("/stories/sandy-beach-2026-11-01-leonna-banzuela");

  await expect(page).toHaveTitle(
    "A nice day at Sandy Beach · Leonna’s journal",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /lovely Auckland coast visit/i,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "/media/sandy-beach/pohutukawa-and-water-1280.webp",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator(".story-copy p:not(.eyebrow)")).toHaveText(
    "Sandy Beach was a lovely place to slow down and enjoy the Auckland coast. The water looked so inviting that I really wanted to go for a swim. Unfortunately, I had not brought my swimsuit, so I could not get in. I still had a nice time taking in the view and would happily return better prepared.",
  );

  await page.getByRole("link", { name: "More at this place" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Sandy Beach" }),
  ).toBeVisible();
  await expect(
    page.getByText("Exact map position is awaiting verification."),
  ).toHaveCount(0);

  await page.goto("/areas/auckland");
  await expect(
    page.getByRole("heading", { level: 1, name: "Auckland" }),
  ).toBeVisible();

  await page.goto("/creators/leonna-banzuela");
  await expect(
    page.getByRole("heading", { level: 1, name: "Leonna Banzuela" }),
  ).toBeVisible();
});

test("unknown direct routes show a useful not-found page", async ({ page }) => {
  const response = await page.goto("/stories/not-a-real-story");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This page is not on the map." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Browse stories" }),
  ).toBeVisible();
});

test("map and accessible list provide the same discovery path", async ({
  page,
}) => {
  await page.goto("/");

  const map = page.getByRole("region", {
    name: /interactive map centered on the verified Sandy Beach visit location/i,
  });
  await expect(map).toBeVisible();
  await expect(
    page.getByRole("link", { name: "OpenStreetMap contributors" }).first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "World" })).toBeVisible();
  await expect(page.getByRole("link", { name: "New Zealand" })).toBeVisible();
  await expect(
    page.getByText("Verified visit location", { exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Read story →", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "A nice day at Sandy Beach" }),
  ).toBeVisible();
});

test("map failure leaves the list route available", async ({ page }) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "1 place with a story" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Place page" })).toHaveAttribute(
    "href",
    "/places/sandy-beach-auckland",
  );
  await expect(
    page.getByText(/visit location is verified from the original media/i),
  ).toBeAttached();
});
