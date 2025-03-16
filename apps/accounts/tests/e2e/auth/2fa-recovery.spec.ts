import { generateValidOTP } from "@/tests/e2e/utils/authenticator";
import { expect, test } from "@playwright/test";

test.describe("2FA Recovery Page", () => {
	test.beforeEach(async ({ page }) => {
		// Intercept and mock the reCAPTCHA script
		await page.route("**/recaptcha/**", (route) => {
			route.fulfill({
				status: 200,
				contentType: "application/javascript",
				body: `
                    window.grecaptcha = {
                    ready: (cb) => cb(),
                    execute: () => Promise.resolve('dummy_recaptcha_token')
                    };
                `,
			});
		});
		// Navigate to login page
		await page.goto("/auth/login");

		// Wait for recaptcha to load
		await page.waitForFunction(() => typeof window.grecaptcha !== "undefined");

		// Fill form with credentials that require 2FA
		await page.getByLabel("Email Address").fill("twofactor-tester@example.org");
		await page
			.getByRole("textbox", { name: "Password Password" })
			.fill("Password123!");
		await page.getByRole("button", { name: "Log in" }).click();

		// Should redirect to 2FA page
		await page.waitForURL("http://localhost:5002/auth/2fa");

		// go to 2fa recovery page
		await page.goto("/auth/2fa/recovery");

		// Wait for recaptcha to load
		await page.waitForFunction(() => typeof window.grecaptcha !== "undefined");
	});

	test("should display 2FA recovery form with all elements", async ({
		page,
	}) => {
		// Check page title
		await expect(page).toHaveTitle(/Two Factor Recovery/);

		// Check form elements
		await expect(page.getByLabel("Recovery Code")).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Verify Code" }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Use your authenticator app instead" }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Try another sign in method" }),
		).toBeVisible();

		// ensure recaptcha terms and conditions are visible
		await expect(
			page.getByText(/This site is protected by reCAPTCHA/),
		).toBeVisible();
		await expect(page.getByText("Privacy Policy")).toBeVisible();
		await expect(page.getByText("Terms of Service")).toBeVisible();
	});

	test("should navigate to 2FA page", async ({ page }) => {
		// increase timeout to incorporate navigation
		test.setTimeout(30_000);
		// Click on 2fa link
		await page
			.getByRole("link", { name: /Use your authenticator app instead/ })
			.click();

		// Verify navigation
		await expect(page).toHaveURL(/\/auth\/2fa/);
	});

	test("should validate empty form submission", async ({ page }) => {
		// Submit without entering data
		await page.getByRole("button", { name: "Verify Code" }).click();

		// Check validation messages
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^This field is required$/ })
				.first(),
		).toBeVisible();
	});

	test("should validate invalid recovery code", async ({ page }) => {
		// Enter invalid email
		await page.getByLabel("Recovery Code").fill("XXXXXXX");
		await page.getByRole("button", { name: "Verify Code" }).click();

		// Check validation message
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^Invalid credentials provided.$/ })
				.first(),
		).toBeVisible();
	});

	test("should not verify authentication code", async ({ page }) => {
		const otp = await generateValidOTP({
			totp_secret: "RW5SJG5SRCHL3YEBPUOOIB6W5VDOF4MA",
		});

		await page.getByLabel("Recovery Code").fill(otp);
		await page.getByRole("button", { name: "Verify Code" }).click();

		// Check validation message
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^Invalid credentials provided.$/ })
				.first(),
		).toBeVisible();
	});

	test("should successfully verify valid recovery code", async ({ page }) => {
		await page.getByLabel("Recovery Code").fill("12345678");
		await page.getByRole("button", { name: "Verify Code" }).click();

		// Should redirect to home page
		await page.waitForURL("http://localhost:5000/");
	});
});

test.describe("2FA Recovery Page Redirects", () => {
	test("should redirect to login page when 2fa challenge expires/ is invalid", async ({
		page,
	}) => {
		// Navigate to 2FA page
		await page.goto("/auth/2fa/recovery");

		// expect to redirect to login page
		await page.waitForURL("http://localhost:5002/auth/login");
	});
});
