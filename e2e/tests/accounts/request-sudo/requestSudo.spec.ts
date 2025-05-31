import { authTest, twoFactorTest, webauthnTest } from "@/playwright/fixtures";

authTest.describe("Request Sudo Mode Page", () => {
	authTest.beforeEach(async ({ page }) => {
		// Navigate to settings page
		await page.goto("http://accounts.localtest.me/request-sudo");
	});

	authTest("should display the request sudo mode page", async ({ page }) => {
		// check for available auth providers
	});
});

webauthnTest.describe("Request Sudo Mode Page (WebAuthn Account)", () => {
	webauthnTest.beforeEach(async ({ page }) => {
		// Navigate to settings page
		await page.goto("http://accounts.localtest.me/request-sudo");
	});

	webauthnTest(
		"should display the request sudo mode page",
		async ({ page }) => {
			// check for available auth providers
		},
	);
});

twoFactorTest.describe("Request Sudo Mode Page (2FA Account)", () => {
	twoFactorTest.beforeEach(async ({ page }) => {
		// Navigate to settings page
		await page.goto("http://accounts.localtest.me/request-sudo");
	});

	twoFactorTest(
		"should display the request sudo mode page",
		async ({ page }) => {
			// check for available auth providers
		},
	);
});
