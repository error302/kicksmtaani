import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should display hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("SNEAKROOM");
  });

  test("should navigate to products", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Shop Collection");
    await expect(page).toHaveURL("/products");
  });

  test("should display categories", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Men")).toBeVisible();
    await expect(page.locator("text=Women")).toBeVisible();
  });
});
