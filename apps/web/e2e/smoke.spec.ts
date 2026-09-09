import { expect, test } from "@playwright/test";

// Unauthenticated visitors are redirected to /login by proxy.ts.
test("redirects to login and shows the sign-in screen", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
});
