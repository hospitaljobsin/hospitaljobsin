import { authTest, expect } from "@/playwright/fixtures";
import { generateValidOTP } from "@/tests/utils/authenticator";
import { waitForCaptcha } from "@/tests/utils/captcha";
import { Jimp } from "jimp";
import fs from "node:fs";
import QrCode from "qrcode-reader";

authTest.describe("Account Settings Page", () => {
	authTest.beforeEach(async ({ page }) => {
		// Navigate to login page
		await page.goto("http://localhost:5002/settings");
	});

	authTest(
		"should display account settings page with all elements",
		async ({ page, passwordAuth }) => {
			// Check for full name
			const fullName = passwordAuth.account.fullName;
			expect(page.getByText(fullName)).not.toBeNull();

			// Check for email
			const email = passwordAuth.account.email;
			expect(page.getByText(email)).not.toBeNull();

			// Check for avatar (Gravatar image)
			const avatar = page
				.getByTestId("account-avatar")
				.getByRole("img", { name: fullName })
				.first();

			// Wait for it to be attached and visible
			await expect(avatar).toBeVisible();
		},
	);

	authTest("should allow user to update their full name", async ({ page }) => {
		// Click the Edit button
		await page.getByRole("button", { name: /edit/i }).click();

		// Fill new full name
		const newName = "Tester New";
		await page.getByLabel("Full Name").fill(newName);
		await page.getByRole("button", { name: /save changes/i }).click();

		// Wait for the form to close and the new name to appear
		await expect(page.getByText(newName)).toBeVisible();
	});

	authTest("should disable delete password button", async ({ page }) => {
		// delete password button should be disabled when the password is the only auth provider
		await expect(
			page.getByRole("button", { name: /delete password/i }),
		).toBeDisabled();
	});

	authTest(
		"should allow user to update their password",
		async ({ page, passwordAuth }) => {
			// Click the Edit button
			await page.getByRole("button", { name: /update password/i }).click();

			// Fill new full name
			const newPassword = "NewPassword123!";
			await page
				.getByRole("textbox", { name: "New Password" })
				.first()
				.fill(newPassword);
			await page
				.getByRole("textbox", { name: "Confirm New Password" })
				.fill(newPassword);
			// await page.getByRole('button', { name: /update password/i }).click();

			// Submit the form
			await Promise.all([
				page.waitForSelector('section[role="dialog"][data-open="true"]', {
					state: "detached",
				}), // modal closes
				page
					.getByRole("button", { name: /update password/i })
					.click(), // click submit
			]);

			// Ensure password has changed- log out and log back in
			const avatarButton = page.locator('button[aria-haspopup="true"]').last();
			await expect(avatarButton).toBeVisible();
			await avatarButton.click();

			// wait for the menu to open
			await page.waitForSelector('div[role="dialog"][data-open="true"]', {
				state: "visible",
			});

			await expect(page.getByText("Signed in as")).toBeVisible();
			await expect(
				page.getByRole("menuitem", { name: "Log Out" }),
			).toBeVisible();

			await Promise.all([
				page.waitForSelector('section[role="dialog"][data-open="true"]'), // or a better selector
				page.getByRole("menuitem", { name: "Log Out" }).click(),
			]);

			await expect(page.getByRole("dialog")).toContainText("Confirm Logout");

			// confirm logout
			await page.getByRole("button", { name: "Logout" }).click();
			await page.waitForURL(/\/auth\/login/);
			// Wait for recaptcha to load
			await waitForCaptcha({ page });

			// login with the new password
			await page.getByLabel("Email Address").fill(passwordAuth.account.email);
			await page
				.getByRole("textbox", { name: "Password Password" })
				.fill(newPassword);
			await page.getByRole("button", { name: "Log in" }).click();

			await page.waitForURL("http://localhost:5002/settings");
		},
	);
});

authTest.describe("Two Factor Authentication", () => {
	authTest.beforeEach(async ({ page }) => {
		// Navigate to login page
		await page.goto("http://localhost:5002/settings");
	});
	authTest(
		"should allow user to enable 2FA authenticator",
		async ({ page }) => {
			await Promise.all([
				page.waitForSelector('section[role="dialog"][data-open="true"]', {
					state: "visible",
				}),
				page.getByRole("button", { name: /enable/i }).click(),
			]);

			await expect(
				page.getByText("Enable Two Factor Authentication"),
			).toBeVisible();

			// we see a QR code and TOTP secret here
			await page
				.getByRole("button", { name: /copy secret to clipboard/i })
				.click();

			const copiedTotpSecret = await page.evaluate(() =>
				navigator.clipboard.readText(),
			);

			const qrLocator = page.locator('[data-testid="totp-qrcode"]'); // Adjust selector if needed
			await qrLocator.screenshot({
				path: "playwright/screenshots/2fa-qrcode.png",
			});

			// Decode the QR code from the screenshot
			const image = await Jimp.read(
				fs.readFileSync("playwright/screenshots/2fa-qrcode.png"),
			);

			const qr = new QrCode();
			let totpSecret = "";

			qr.callback = (err, value) => {
				if (err) {
					throw new Error("❌ Failed to decode QR code:", err);
				}
				totpSecret = value.result;
				console.log("✅ QR code content:", value.result);
			};
			qr.decode(image.bitmap);

			expect(totpSecret).toEqual(copiedTotpSecret);

			const otp = await generateValidOTP({ totp_secret: copiedTotpSecret });

			await page.locator('input[name="token"]').fill(otp);

			await page.getByRole("button", { name: /enable/i }).click();

			// save recovery codes
			await Promise.all([
				// Wait for the modal to close
				page.waitForSelector('section[role="dialog"][data-open="true"]', {
					state: "detached",
				}),
				// Click the enable button
				page
					.getByRole("button", { name: /I've saved my recovery codes/i })
					.click(),
			]);

			await expect(
				page.getByRole("button", { name: /disable/i }),
			).toBeVisible();
		},
	);
});

// TODO: test no sudo mode redirects to request sudo mode page

// TODO: add new fixture to authenticate with two factor account
// add 2fa disabling tests for that account
