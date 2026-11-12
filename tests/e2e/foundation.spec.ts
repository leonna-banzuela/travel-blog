import { expect, test } from "@playwright/test";

test("renders the read-only travel journal foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Travel stories by Leonna Banzuela");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Every place holds a dated story.",
  );
  await expect(
    page.getByRole("heading", { name: "Auckland stories" }),
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
    page.getByRole("heading", { name: "Auckland stories" }),
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
  ).toHaveCount(0);
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
    /quiet visit to Sandy Beach/i,
  );

  await page.getByRole("link", { name: "More at this place" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Sandy Beach" }),
  ).toBeVisible();
  await expect(
    page.getByText("Exact map position is awaiting verification."),
  ).toBeVisible();

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
