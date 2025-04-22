import { waitForCaptcha } from "@/tests/utils/captcha";
import {
	NONEXISTENT_TESTER_EMAIL,
	PASSWORD_RESET_TOKEN_COOLDOWN,
	TESTER_EMAIL,
	TESTER_EMAIL_2,
} from "@/tests/utils/constants";
import { findLastEmail } from "@/tests/utils/mailcatcher";
import { expect, test } from "@playwright/test";

test.describe("Request Password Reset Page", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to reset password page
		await page.goto("http://localhost:5002/auth/reset-password");
		// Wait for recaptcha to load
		await waitForCaptcha({ page });
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
		const emailAddress = TESTER_EMAIL;
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
			filter: (e) =>
				e.recipients.includes(`<${emailAddress}>`) &&
				e.subject.includes("Password Reset Request"),
		});

		expect(emailMessage).not.toBeNull();

		await page.getByRole("button", { name: "Back to login" }).click();

		await page.waitForURL(/\/auth\/login/);
	});

	test("should handle invalid password reset email", async ({
		page,
		request,
	}) => {
		const emailAddress = NONEXISTENT_TESTER_EMAIL;
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

		await page.getByRole("button", { name: "Back to login" }).click();

		await page.waitForURL(/\/auth\/login/);
	});

	test("should navigate to login page", async ({ page }) => {
		// increase timeout to incorporate navigation
		test.setTimeout(30_000);
		// Click on login link
		await page.getByRole("link", { name: /Back to login/ }).click();

		// Verify navigation
		await expect(page).toHaveURL(/\/auth\/login/);
	});

	test("should handle cooldown on multiple password reset requests", async ({
		page,
		request,
	}) => {
		// increase timeout to incorporate cooldown
		test.setTimeout(45_000);
		const emailAddress = TESTER_EMAIL_2;

		// First password reset request

		await page.getByLabel("Email Address").fill(emailAddress);
		await page.getByRole("button", { name: "Request Password Reset" }).click();

		await expect(
			page.getByText(
				/If an account with that email exists, we will send you a password reset link. Please check your email inbox./,
			),
		).toBeVisible();

		const firstEmail = await findLastEmail({
			request,
			timeout: 10_000,
			filter: (e) =>
				e.recipients.includes(`<${emailAddress}>`) &&
				e.subject.includes("Password Reset Request"),
		});

		expect(firstEmail).not.toBeNull();

		// Navigate to reset password page
		await page.goto("http://localhost:5002/auth/reset-password");
		// Wait for recaptcha to load
		await waitForCaptcha({ page });

		// Second password reset request immediately after
		await page.getByLabel("Email Address").fill(emailAddress);
		await page.getByRole("button", { name: "Request Password Reset" }).click();

		await expect(
			page.getByText(
				/If an account with that email exists, we will send you a password reset link. Please check your email inbox./,
			),
		).toBeVisible();

		const secondEmail = await findLastEmail({
			request,
			timeout: 3_000,
			filter: (e) =>
				e.recipients.includes(`<${emailAddress}>`) &&
				e.subject.includes("Password Reset Request"),
		});

		// Ensure no second email was sent due to rate limit
		expect(secondEmail).not.toBeNull();
		expect(secondEmail.id).toEqual(firstEmail.id);

		// Wait for cooldown and try again (after testing env rate limit expires)
		await page.waitForTimeout(PASSWORD_RESET_TOKEN_COOLDOWN);

		// Navigate to reset password page
		await page.goto("http://localhost:5002/auth/reset-password");
		// Wait for recaptcha to load
		await waitForCaptcha({ page });

		await page.getByLabel("Email Address").fill(emailAddress);
		await page.getByRole("button", { name: "Request Password Reset" }).click();

		await expect(
			page.getByText(
				/If an account with that email exists, we will send you a password reset link. Please check your email inbox./,
			),
		).toBeVisible();

		const thirdEmail = await findLastEmail({
			request,
			timeout: 10_000,
			filter: (e) =>
				e.recipients.includes(`<${emailAddress}>`) &&
				e.subject.includes("Password Reset Request"),
		});

		// Confirm third attempt succeeded after rate limit expired
		expect(thirdEmail).not.toBeNull();
		expect(thirdEmail.id).not.toEqual(firstEmail.id);
	});
});

test.describe("Request Password Reset Page Authentication Redirects", () => {
	test.use({
		storageState: "playwright/.auth/user.json",
	});

	test("should not redirect to home page when already authenticated", async ({
		page,
	}) => {
		await page.goto("http://localhost:5002/auth/reset-password");
		// ensure we are not redirected here
		await expect(page).not.toHaveURL("http://localhost:5000/");
		await expect(page).toHaveURL("http://localhost:5002/auth/reset-password");
	});
});
