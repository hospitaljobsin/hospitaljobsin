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

    test("should disable delete password button", async ({ page }) => {
        // delete password button should be disabled when the password is the only auth provider
        await expect(page.getByRole('button', { name: /delete password/i })).toBeDisabled();
    });

    test("should allow user to update their password", async ({ page }) => {
        // Click the Edit button
        await page.getByRole('button', { name: /update password/i }).click();

        // Fill new full name
        const newPassword = `NewPassword123!`;
        await page
        .getByRole("textbox", { name: "New Password" }).first()
        .fill(newPassword);
        await page
        .getByRole("textbox", { name: "Confirm New Password" })
        .fill(newPassword);
        await page.getByRole('button', { name: /update password/i }).click();

        // TODO: Ensure password has changed- log out and log back in
        const navAvatar = page.locator('img[src*="gravatar.com"]').first();

        await navAvatar.click();

        await page.getByText('Log Out').click();

        await page.waitForURL('http://localhost:5002/auth/login');
        // Wait for recaptcha to load
        await waitForCaptcha({ page });

        // login with the new password
        await page.getByLabel("Email Address").fill(TESTER_EMAIL);
        await page
            .getByRole("textbox", { name: "Password Password" })
            .fill(newPassword);
        await page.getByRole("button", { name: "Log in" }).click();

        await page.waitForURL("http://localhost:5000/");
    });


});
