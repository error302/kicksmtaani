import { test, expect } from "@playwright/test";

test.describe("Checkout Flow", () => {
  test("should show empty cart message", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.locator("text=Your cart is empty")).toBeVisible();
  });

  test("should navigate to products from empty cart", async ({ page }) => {
    await page.goto("/checkout");
    await page.click("text=Continue Shopping");
    await expect(page).toHaveURL("/products");
  });
});
