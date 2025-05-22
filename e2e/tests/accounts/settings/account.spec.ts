import { waitForCaptcha } from "@/tests/utils/captcha";
import { TESTER_EMAIL, TESTER_USERNAME } from "@/tests/utils/constants";
import { expect, test } from "@playwright/test";

test.describe("Account Settings Page", () => {
	test.use({
		storageState: "playwright/.auth/user.json",
	});

    test.beforeEach(async ({ page }) => {
        // Navigate to login page
        await page.goto("http://localhost:5002/settings");
        // Wait for recaptcha to load
        await waitForCaptcha({ page });
    });

    test("should display account settings page with all elements", async ({ page }) => {
        // Check for full name
        const fullName = TESTER_USERNAME;
        await expect(page.getByText(fullName)).not.toBeNull();

        // Check for email
        const email = TESTER_EMAIL;
        await expect(page.getByText(email)).not.toBeNull();

        // Check for avatar (Gravatar image)
        const avatar = page.locator('img[src*="gravatar.com"], [data-testid="account-avatar"]');

        // Wait for it to be attached and visible
        await expect(avatar).toBeVisible();
    });

    test("should allow user to update their full name", async ({ page }) => {
        // Click the Edit button
        await page.getByRole('button', { name: /edit/i }).click();

        // Fill new full name
        const newName = `Tester New`;
        await page.getByLabel('Full Name').fill(newName);
        await page.getByRole('button', { name: /save changes/i }).click();

        // Wait for the form to close and the new name to appear
        await expect(page.getByText(newName)).toBeVisible();
    });
});
