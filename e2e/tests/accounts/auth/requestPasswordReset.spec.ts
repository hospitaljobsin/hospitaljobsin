import { env } from "@/lib/env";
import { authTest, expect, test } from "@/playwright/fixtures";
import { waitForCaptcha } from "@/tests/utils/captcha";
import { PASSWORD_RESET_TOKEN_COOLDOWN } from "@/tests/utils/constants";
import {
	findLastEmail,
	generateUniqueEmail,
	registerEmailAddress,
} from "@/tests/utils/emails";
import { generateGlobalId } from "@/tests/utils/id";

test.describe("Request Password Reset Page", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to reset password page
		await page.goto(`${env.ACCOUNTS_UI_BASE_URL}/auth/reset-password`);
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
			page.getByText(/This site is protected by Cloudflare Turnstile/),
		).toBeVisible();
		await expect(page.getByText("Cloudflare Privacy Policy")).toBeVisible();
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
				.filter({ hasText: /^Invalid email address$/ })
				.first(),
		).toBeVisible();
	});

	test("should successfully send password reset email", async ({
		page,
		request,
		passwordAuth,
	}) => {
		test.setTimeout(45_000);
		const emailAddress = passwordAuth.account.email;
		await registerEmailAddress({ email: emailAddress });
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
			inboxAddress: emailAddress,
			filter: (e) => e.subject.includes("Password Reset Request"),
		});

		expect(emailMessage).not.toBeNull();

		await page.getByRole("button", { name: "Back to login" }).click();

		await page.waitForURL(/\/auth\/login/);
	});

	test("should handle invalid password reset email", async ({ page, request }, {
		project,
		workerIndex,
	}) => {
		const emailAddress = await generateUniqueEmail(
			`non-existent-tester-${generateGlobalId(workerIndex, project.name)}`,
		);
		await registerEmailAddress({ email: emailAddress });
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
			inboxAddress: emailAddress,
			filter: (e) => e.subject.includes("Password Reset Request"),
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
});

test.describe("Request Password Reset Page Rate Limiting", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to reset password page
		await page.goto(`${env.ACCOUNTS_UI_BASE_URL}/auth/reset-password`);
		// Wait for recaptcha to load
		await waitForCaptcha({ page });
	});

	test("should handle cooldown on multiple password reset requests", async ({
		page,
		request,
		passwordAuth,
	}) => {
		// increase timeout to incorporate cooldown
		test.setTimeout(45_000);
		const emailAddress = passwordAuth.account.email;
		await registerEmailAddress({ email: emailAddress });

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
			timeout: 15_000,
			inboxAddress: emailAddress,
			filter: (e) => e.subject.includes("Password Reset Request"),
		});

		expect(firstEmail).not.toBeNull();
		if (!firstEmail) {
			throw new Error("First email not found");
		}
		// Navigate to reset password page
		await page.goto(`${env.ACCOUNTS_UI_BASE_URL}/auth/reset-password`);
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
			inboxAddress: emailAddress,
			filter: (e) => e.subject.includes("Password Reset Request"),
		});

		// Ensure no second email was sent due to rate limit
		expect(secondEmail).not.toBeNull();
		if (!secondEmail) {
			throw new Error("Second email not found");
		}
		expect(secondEmail.id).toEqual(firstEmail.id);

		// Wait for cooldown and try again (after testing env rate limit expires)
		await page.waitForTimeout(PASSWORD_RESET_TOKEN_COOLDOWN);

		// Navigate to reset password page
		await page.goto(`${env.ACCOUNTS_UI_BASE_URL}/auth/reset-password`);
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
			timeout: 15_000,
			inboxAddress: emailAddress,
			filter: (e) => e.subject.includes("Password Reset Request"),
		});

		// Confirm third attempt succeeded after rate limit expired
		expect(thirdEmail).not.toBeNull();
		if (!thirdEmail) {
			throw new Error("Third email not found");
		}
		expect(thirdEmail.id).not.toEqual(firstEmail.id);
	});
});

authTest.describe(
	"Request Password Reset Page Authentication Redirects",
	() => {
		authTest(
			"should not redirect to home page when already authenticated",
			async ({ page }) => {
				await page.goto(`${env.ACCOUNTS_UI_BASE_URL}/auth/reset-password`);
				// ensure we are not redirected here
				await expect(page).not.toHaveURL(`${env.SEEKER_PORTAL_BASE_URL}/`);
				await expect(page).toHaveURL(
					`${env.ACCOUNTS_UI_BASE_URL}/auth/reset-password`,
				);
			},
		);
	},
);
