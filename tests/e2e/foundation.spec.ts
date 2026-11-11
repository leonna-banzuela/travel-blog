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
