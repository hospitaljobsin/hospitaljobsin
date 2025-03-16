import { expect, test } from "@playwright/test";
import { findLastEmail } from "../utils/mailcatcher";

test.describe("Request Password Reset Page", () => {
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
		// Navigate to reset password page
		await page.goto("/auth/reset-password");
		// Wait for recaptcha to load
		await page.waitForFunction(() => typeof window.grecaptcha !== "undefined");
	});

	test("should display reset password form with all elements", async ({
		page,
	}) => {
		// Check page title
		await expect(page).toHaveTitle(/Reset Password/);

		await expect(page.getByText(/Reset Your Password/)).toBeVisible();

		// Check form elements
		await expect(page.getByLabel("Email Address")).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Request Password Reset" }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Back to login" }),
		).toBeVisible();

		// ensure recaptcha terms and conditions are visible
		await expect(
			page.getByText(/This site is protected by reCAPTCHA/),
		).toBeVisible();
		await expect(page.getByText("Privacy Policy")).toBeVisible();
		await expect(page.getByText("Terms of Service")).toBeVisible();
	});

	test("should validate empty form submission", async ({ page }) => {
		// Submit without entering data
		await page.getByRole("button", { name: "Request Password Reset" }).click();

		// Check validation messages
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^This field is required$/ })
				.first(),
		).toBeVisible();
	});

	test("should validate email format", async ({ page }) => {
		// Enter invalid email
		await page.getByLabel("Email Address").fill("invalid-email");
		await page.getByRole("button", { name: "Request Password Reset" }).click();

		// Check validation message
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^Invalid email$/ })
				.first(),
		).toBeVisible();
	});

	test("should successfully send password reset email", async ({
		page,
		request,
	}) => {
		const emailAddress = "tester@example.org";
		await page.getByLabel("Email Address").fill(emailAddress);
		await page.getByRole("button", { name: "Request Password Reset" }).click();

		await expect(
			page.getByText(
				/If an account with that email exists, we will send you a password reset link. Please check your email inbox./,
			),
		).toBeVisible();

		const emailMessage = await findLastEmail({
			request,
			timeout: 10_000,
			filter: (e) => e.recipients.includes(`<${emailAddress}>`),
		});

		expect(emailMessage).not.toBeNull();

		expect(emailMessage.subject).toContain("Password Reset Request");
	});

	test("should handle invalid password reset email", async ({
		page,
		request,
	}) => {
		const emailAddress = "nonexistent-tester@example.org";
		await page.getByLabel("Email Address").fill(emailAddress);
		await page.getByRole("button", { name: "Request Password Reset" }).click();

		await expect(
			page.getByText(
				/If an account with that email exists, we will send you a password reset link. Please check your email inbox./,
			),
		).toBeVisible();

		const emailMessage = await findLastEmail({
			request,
			timeout: 2_000,
			filter: (e) => e.recipients.includes(`<${emailAddress}>`),
		});

		expect(emailMessage).toBeNull();
	});

	test("should navigate to login page", async ({ page }) => {
		// increase timeout to incorporate navigation
		test.setTimeout(30_000);
		// Click on login link
		await page.getByRole("link", { name: /Back to login/ }).click();

		// Verify navigation
		await expect(page).toHaveURL(/\/auth\/login/);
	});
});
