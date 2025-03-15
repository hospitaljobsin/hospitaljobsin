import { expect, test } from "@playwright/test";
import { findLastEmail } from "../utils/mailcatcher";

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

	test("should validate invalid email verification token", async ({ page }) => {
		const emailAddress = "new-tester@outlook.com";
		await test.step("Step 1: Enter email address", async () => {
			await page.getByLabel("Email Address").fill(emailAddress);

			await page.getByRole("button", { name: "Continue" }).click();
		});

		// ensure we get to step 2
		await expect(page.getByLabel("Email Address")).toHaveAttribute("readonly");
		await expect(page.getByLabel("Email Verification Token")).toBeVisible();

		await test.step("Step 2: Enter verification token", async () => {
			await page
				.getByRole("textbox", { name: "Email Verification Token" })
				.fill("XXXXXXX");

			await page.getByRole("button", { name: "Continue" }).click();

			// Check validation message
			await expect(
				page
					.locator("div")
					.filter({ hasText: /^Invalid email verification token provided.$/ })
					.first(),
			).toBeVisible();
		});
	});

	test("should successfully register with password", async ({
		page,
		request,
		context,
	}) => {
		const emailAddress = "new-tester@outlook.com";
		await test.step("Step 1: Enter email address", async () => {
			await page.getByLabel("Email Address").fill(emailAddress);

			await page.getByRole("button", { name: "Continue" }).click();
		});

		// ensure we get to step 2
		await expect(page.getByLabel("Email Address")).toHaveAttribute("readonly");
		await expect(page.getByLabel("Email Verification Token")).toBeVisible();

		// TODO: get code from email here
		const emailMessage = await findLastEmail({
			request,
			timeout: 5_000,
			filter: (e) => e.recipients.includes(`<${emailAddress}>`),
		});

		// Open email in a new browser context/tab
		const emailPage = await context.newPage();
		await emailPage.goto(
			`http://localhost:1080/messages/${emailMessage.id}.html`,
		);

		// Extract verification code from the email content
		const verificationCode = await emailPage.evaluate(() => {
			// Find the token in the email content which appears in an h1 element
			const codeElement = document.querySelector(".btn-primary h1");
			if (codeElement) {
				return codeElement.textContent?.trim() || "";
			}
			// Fallback in case the structure changes
			const emailText = document.body.textContent || "";
			const matches = emailText.match(/([A-Z0-9]{6})/);
			return matches?.[1] || "";
		});

		// Close the email tab
		await emailPage.close();

		await test.step("Step 2: Enter verification token", async () => {
			await page
				.getByRole("textbox", { name: "Email Verification Token" })
				.fill(verificationCode);

			await page.getByRole("button", { name: "Continue" }).click();
		});

		// ensure we get to step 3
		await expect(page.getByLabel("Full Name")).toBeVisible();

		await test.step("Step 3: Enter full name", async () => {
			await page.getByLabel("Full Name").fill("Tester");

			await page.getByRole("button", { name: "Continue" }).click();
		});

		// ensure we get to step 4
		// await expect(page.getByLabel("Full Name")).toBeVisible();
	});
});
