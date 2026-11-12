import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/stories",
  "/stories/sandy-beach-2026-11-01-leonna-banzuela",
  "/places/sandy-beach-auckland",
  "/not-a-real-route",
];

for (const route of publicRoutes) {
  test(`has no serious accessibility violations on ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (violation) =>
        violation.impact === "critical" || violation.impact === "serious",
    );
    expect(serious).toEqual([]);
  });
}

test("owner studio has no serious accessibility violations", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4178");
  await expect(
    page.getByRole("heading", { name: /Leonna’s story studio/i }),
  ).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const serious = results.violations.filter(
    (violation) =>
      violation.impact === "critical" || violation.impact === "serious",
  );
  expect(serious).toEqual([]);
});
