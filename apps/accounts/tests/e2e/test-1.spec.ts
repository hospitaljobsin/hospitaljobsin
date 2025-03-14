import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
	await page.goto("http://localhost:5002/auth/login");
	await page
		.getByRole("textbox", { name: "Email Address Email Address" })
		.click();
	await expect(
		page
			.locator("div")
			.filter({ hasText: /^Invalid email$/ })
			.first(),
	).toBeVisible();
	await page
		.locator("div")
		.filter({ hasText: /^This field is required$/ })
		.first()
		.click();
});
