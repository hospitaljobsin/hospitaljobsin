import { expect, test } from "@playwright/test";

test.describe("Sign Up Page", () => {
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
		await page.goto("/auth/signup");
		// Wait for recaptcha to load
		await page.waitForFunction(() => typeof window.grecaptcha !== "undefined");
	});

	test("should display signup form with all elements", async ({ page }) => {
		// Check page title
		await expect(page).toHaveTitle(/Sign Up/);

		await expect(page.getByText(/Create your account/)).toBeVisible();

		// Check form elements
		await expect(page.getByLabel("Email Address")).toBeVisible();
		await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();

		// ensure recaptcha terms and conditions are visible
		await expect(
			page.getByText(/This site is protected by reCAPTCHA/),
		).toBeVisible();
		await expect(page.getByText("Privacy Policy")).toBeVisible();
		await expect(page.getByText("Terms of Service")).toBeVisible();
	});

	test("should validate empty form submission", async ({ page }) => {
		// Submit without entering data
		await page.getByRole("button", { name: "Continue" }).click();

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

		await page.getByRole("button", { name: "Continue" }).click();

		// Check validation message
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^Invalid email$/ })
				.first(),
		).toBeVisible();
	});

	test("should redirect successfully to Google accounts page on Google signup", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Sign up with Google" }).click();

		await page.waitForURL("https://accounts.google.com/**");
	});

	test("should successfully register with password", async ({ page }) => {
		await test.step("Step 1: Enter email address", async () => {
			await page.getByLabel("Email Address").fill("new-tester@outlook.com");

			await page.getByRole("button", { name: "Continue" }).click();
		});

		// ensure we get to step 2
		await expect(page.getByLabel("Email Address")).toHaveAttribute("readonly");
		await expect(page.getByLabel("Email Verification Token")).toBeVisible();

		// TODO: get code from email here

		await test.step("Step 2: Enter verification token", async () => {
			await page
				.getByRole("textbox", { name: "Email Verification Token" })
				.fill("123456");

			await page.getByRole("button", { name: "Continue" }).click();
		});
	});
});
