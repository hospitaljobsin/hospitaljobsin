import {
	authSudoModeTest,
	authTest,
	expect,
	twoFactorTest,
	webauthnSudoModeTest,
} from "@/playwright/fixtures";
import { generateValidOTP } from "@/tests/utils/authenticator";
import { waitForCaptcha } from "@/tests/utils/captcha";
import { Jimp } from "jimp";
import fs from "node:fs";
import QrCode from "qrcode-reader";

authTest.describe("Account Settings Page", () => {
	authTest.beforeEach(async ({ page }) => {
		// Navigate to settings page
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

	// ensure that sudo mode buttons redirect to the sudo mode request page

	authTest(
		"update password button should redirect to request sudo mode",
		async ({ page, passwordAuth }) => {
			// Click the Update Password button
			await page.getByRole("button", { name: /update password/i }).click();

			await page.waitForURL(/request-sudo/);
		},
	);

	authTest(
		"enable 2fa authenticator should redirect to request sudo mode",
		async ({ page, passwordAuth }) => {
			// Click the Enable 2FA button
			await page.getByRole("button", { name: /enable/i }).click();

			await page.waitForURL(/request-sudo/);
		},
	);
});

authSudoModeTest.describe("Account Settings Page (Sudo Mode)", () => {
	authSudoModeTest.beforeEach(async ({ page }) => {
		// Navigate to settings page
		await page.goto("http://localhost:5002/settings");
	});

	authSudoModeTest(
		"should allow user to enable/disable 2FA authenticator",
		async ({ page, browserName }) => {
			await authSudoModeTest.step("Enable 2FA Authenticator", async () => {
				await expect(
					page.getByRole("button", { name: /enable/i }),
				).toBeVisible();

				await Promise.all([
					page.getByRole("button", { name: /enable/i }).click(),
					page.waitForSelector('section[role="dialog"][data-open="true"]', {
						state: "visible",
					}),
				]);

				await expect(
					page.getByText("Enable Two Factor Authentication"),
				).toBeVisible();

				// we see a QR code and TOTP secret here
				const qrLocator = page.locator('[data-testid="totp-qrcode"]'); // Adjust selector if needed
				await expect(qrLocator).toBeVisible();
				await qrLocator.screenshot({
					path: "playwright/screenshots/2fa-qrcode.png",
					scale: "css", // ensures full resolution capture
				});

				// Decode the QR code from the screenshot
				const image = await Jimp.read(
					fs.readFileSync("playwright/screenshots/2fa-qrcode.png"),
				);

				const qr = new QrCode();
				let totpSecretUrl = "";

				qr.callback = (
					err: ErrorOptions | undefined,
					value: { result: string },
				) => {
					if (err) {
						throw new Error("❌ Failed to decode QR code:", err);
					}
					totpSecretUrl = value.result;
					console.log("✅ QR code content:", value.result);
				};
				qr.decode(image.bitmap);

				const totpSecret = totpSecretUrl.split("secret=")[1].split("&")[0];

				if (browserName !== "webkit") {
					// we have navigation API permissions issues on webkit, so we cannot copy to clipboard
					// https://github.com/microsoft/playwright/issues/13037
					await page
						.getByRole("button", { name: /copy secret to clipboard/i })
						.click();

					const copiedTotpSecret = await page.evaluate(() =>
						navigator.clipboard.readText(),
					);

					expect(totpSecret).toEqual(copiedTotpSecret);
				}

				const otp = await generateValidOTP({ totp_secret: totpSecret });

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
			});

			await authSudoModeTest.step("Disable 2FA Authenticator", async () => {
				await expect(
					page.getByRole("button", { name: /disable/i }),
				).toBeVisible();

				await Promise.all([
					page.getByRole("button", { name: /disable/i }).click(),
					page.waitForSelector('section[role="dialog"][data-open="true"]', {
						state: "visible",
					}),
				]);

				await expect(
					page.getByRole("heading", {
						name: "Disable Two Factor Authentication",
					}),
				).toBeVisible();

				// disable 2FA
				await Promise.all([
					// Wait for the modal to close
					page.waitForSelector('section[role="dialog"][data-open="true"]', {
						state: "detached",
					}),
					// Click the enable button
					page
						.getByRole("button", { name: /disable/i })
						.click(),
				]);
			});
		},
	);

	authSudoModeTest(
		"should allow user to update their password",
		async ({ page, passwordAuthSudoMode }) => {
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
			await page
				.getByLabel("Email Address")
				.fill(passwordAuthSudoMode.account.email);
			await page
				.getByRole("textbox", { name: "Password Password" })
				.fill(newPassword);
			await page.getByRole("button", { name: "Log in" }).click();

			await page.waitForURL("http://localhost:5002/settings");
		},
	);
});

twoFactorTest.describe("Account Settings Page- 2FA Account", () => {
	twoFactorTest.beforeEach(async ({ page }) => {
		// Navigate to settings page
		await page.goto("http://localhost:5002/settings");
	});

	twoFactorTest(
		"disabling 2FA should redirect to request sudo mode",
		async ({ page, twoFactorAuth }) => {
			// Click the Disable 2FA button
			await page.getByRole("button", { name: /disable/i }).click();

			await page.waitForURL(/request-sudo/);
		},
	);
});

webauthnSudoModeTest.describe(
	"Account Settings Page- Webauthn Account (Sudo Mode)",
	() => {
		webauthnSudoModeTest.beforeEach(async ({ page }) => {
			// Navigate to settings page
			await page.goto("http://localhost:5002/settings");
		});

		webauthnSudoModeTest(
			"should allow user to set/ remove their password",
			async ({ page, webauthnAuthSudoMode }) => {
				await webauthnSudoModeTest.step("Set New Password", async () => {
					// delete password button shouldn't be there when we have no password
					await expect(
						page.getByRole("button", { name: /delete password/i }),
					).not.toBeVisible();

					await expect(
						page.getByRole("button", { name: /set password/i }),
					).toBeVisible();

					// Click the set password button
					await page.getByRole("button", { name: /set password/i }).click();

					// Fill new full name
					const newPassword = "NewPassword123!";
					await page
						.getByRole("textbox", { name: "New Password" })
						.first()
						.fill(newPassword);
					await page
						.getByRole("textbox", { name: "Confirm New Password" })
						.fill(newPassword);

					// Submit the form
					await Promise.all([
						page.waitForSelector('section[role="dialog"][data-open="true"]', {
							state: "detached",
						}), // modal closes
						page
							.getByRole("button", { name: /set password/i })
							.click(), // click submit
					]);

					// Ensure password has changed- log out and log back in
					const avatarButton = page
						.locator('button[aria-haspopup="true"]')
						.last();
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

					await expect(page.getByRole("dialog")).toContainText(
						"Confirm Logout",
					);

					// confirm logout
					await page.getByRole("button", { name: "Logout" }).click();
					await page.waitForURL(/\/auth\/login/);
					// Wait for recaptcha to load
					await waitForCaptcha({ page });

					// login with the new password
					await page
						.getByLabel("Email Address")
						.fill(webauthnAuthSudoMode.account.email);
					await page
						.getByRole("textbox", { name: "Password Password" })
						.fill(newPassword);
					await page.getByRole("button", { name: "Log in" }).click();

					await page.waitForURL("http://localhost:5002/settings");
				});

				await webauthnSudoModeTest.step("Delete New Password", async () => {
					await expect(
						page.getByRole("button", { name: /delete password/i }),
					).toBeVisible();

					await Promise.all([
						page.getByRole("button", { name: /delete password/i }).click(),
						page.waitForSelector('section[role="dialog"][data-open="true"]', {
							state: "visible",
						}),
					]);

					// Submit the form
					await Promise.all([
						page.waitForSelector('section[role="dialog"][data-open="true"]', {
							state: "detached",
						}), // modal closes
						page
							.getByRole("button", { name: /delete password/i })
							.click(), // click submit
					]);

					await expect(
						page.getByRole("button", { name: /set password/i }),
					).toBeVisible();

					await expect(
						page.getByRole("button", { name: /delete password/i }),
					).not.toBeVisible();
				});
			},
		);
	},
);
