import { authTest, expect } from "@/playwright/fixtures";
import { waitForCaptcha } from "@/tests/utils/captcha";

authTest.describe("Account Settings Page", () => {
    authTest.beforeEach(async ({ page }) => {
        // Navigate to login page
        await page.goto("http://localhost:5002/settings");
    });

    authTest("should display account settings page with all elements", async ({ page, testAccounts }) => {
        // Check for full name
        const fullName = testAccounts.passwordAccount.fullName;
        await expect(page.getByText(fullName)).not.toBeNull();

        // Check for email
        const email = testAccounts.passwordAccount.email;
        await expect(page.getByText(email)).not.toBeNull();

        // Check for avatar (Gravatar image)
        const avatar = page.getByTestId('account-avatar').getByRole('img', { name: fullName }).first();

        // Wait for it to be attached and visible
        await expect(avatar).toBeVisible();
    });

    authTest("should allow user to update their full name", async ({ page }) => {
        // Click the Edit button
        await page.getByRole('button', { name: /edit/i }).click();

        // Fill new full name
        const newName = `Tester New`;
        await page.getByLabel('Full Name').fill(newName);
        await page.getByRole('button', { name: /save changes/i }).click();

        // Wait for the form to close and the new name to appear
        await expect(page.getByText(newName)).toBeVisible();
    });

    authTest("should disable delete password button", async ({ page }) => {
        // delete password button should be disabled when the password is the only auth provider
        await expect(page.getByRole('button', { name: /delete password/i })).toBeDisabled();
    });

    authTest("should allow user to update their password", async ({ page, testAccounts }) => {
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

        // wait for modal to close here
        await page.waitForSelector('section[role="dialog"][data-open="true"]', { state: 'detached' });

        // Ensure password has changed- log out and log back in
        const avatarButton = page.locator('button[aria-haspopup="true"]').last();
        await expect(avatarButton).toBeVisible();
        await avatarButton.click();

        await expect(page.getByText("Signed in as")).toBeVisible();

        await page.getByText('Log Out').click();

        // confirm logout
        await page.getByRole('button', { name: 'Logout' }).click();
        await page.waitForURL(/\/auth\/login/);
        // Wait for recaptcha to load
        await waitForCaptcha({ page });

        // login with the new password
        await page.getByLabel("Email Address").fill(testAccounts.passwordAccount.email);
        await page
            .getByRole("textbox", { name: "Password Password" })
            .fill(newPassword);
        await page.getByRole("button", { name: "Log in" }).click();

        await page.waitForURL("http://localhost:5002/settings");
    });


});
