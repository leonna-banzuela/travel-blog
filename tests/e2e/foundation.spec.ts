import { expect, test } from "@playwright/test";

test("renders the read-only travel journal foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Travel stories by Leonna Banzuela");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Places become stories.",
  );
  await expect(
    page.getByRole("heading", { name: "Auckland stories are coming next" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /travel journal home/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /log in|sign up/i })).toHaveCount(
    0,
  );
});
