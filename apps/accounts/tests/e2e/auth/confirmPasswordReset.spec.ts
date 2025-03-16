import type { PlaywrightTestArgs } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { findLastEmail } from "../utils/mailcatcher";

test.describe("Confirm Password Reset Page", () => {
	test.beforeEach(async ({ page, request, context }) => {
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
			filter: (e) =>
				e.recipients.includes(`<${emailAddress}>`) &&
				e.subject.includes("Password Reset Request"),
		});

		expect(emailMessage).not.toBeNull();

		await page.goto(`http://localhost:1080/messages/${emailMessage.id}.html`);

		// Extract the reset password link
		const resetLink = await page.getAttribute(
			'a[href*="reset-password"]',
			"href",
		);

		expect(resetLink).not.toBeNull();

		await page.goto(resetLink);
	});

	test("should display confirm reset password form with all elements", async ({
		page,
	}) => {
		// Check page title
		await expect(page).toHaveTitle(/Password Reset/);

		await expect(page.getByText(/Reset Your Password/)).toBeVisible();

		// Check form elements
		await expect(page.getByLabel("Email Address")).toHaveAttribute("readonly");
		await expect(
			page.getByRole("textbox", { name: "New Password New Password" }),
		).toBeVisible();
		await expect(
			page.getByRole("textbox", { name: "Confirm New Password Confirm" }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Reset Password" }),
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
		await page.getByRole("button", { name: "Reset Password" }).click();

		// Check validation messages
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^This field is required$/ })
				.first(),
		).toBeVisible();

		await expect(
			page
				.locator("div")
				.filter({ hasText: /^This field is required$/ })
				.nth(2),
		).toBeVisible();
	});

	test("should successfully reset password", async ({ page, request }) => {
		await page
			.getByRole("textbox", { name: "New Password New Password" })
			.fill("Password123!");
		await page
			.getByRole("textbox", { name: "Confirm New Password Confirm" })
			.fill("Password123!");
		await page.getByRole("button", { name: "Reset Password" }).click();

		await page.waitForURL("http://localhost:5000/");
	});

	async function enterPassword({
		page,
		password,
		confirmPassword,
	}: {
		password: string;
		confirmPassword: string;
		page: PlaywrightTestArgs["page"];
	}) {
		await page
			.getByRole("textbox", { name: "New Password New Password" })
			.fill(password);
		await page
			.getByRole("textbox", { name: "Confirm New Password Confirm" })
			.fill(confirmPassword);
		await page.getByRole("button", { name: "Reset Password" }).click();
	}

	test("should handle invalid password", async ({ page }) => {
		await test.step("Enter short password", async () => {
			await enterPassword({ page, password: "123", confirmPassword: "123" });
			await expect(
				page.getByText("Password must be at least 8 characters long."),
			).toBeVisible();
		});

		await test.step("Enter password without capital letters", async () => {
			await enterPassword({
				page,
				password: "abcdefghijk",
				confirmPassword: "abcdefghijk",
			});
			await expect(
				page.getByText("Password must contain at least one uppercase letter."),
			).toBeVisible();
		});

		await test.step("Enter password without numbers", async () => {
			await enterPassword({
				page,
				password: "Abcdefghijk",
				confirmPassword: "Abcdefghijk",
			});
			await expect(
				page.getByText("Password must contain at least one number."),
			).toBeVisible();
		});

		await test.step("Enter password without special letters", async () => {
			await enterPassword({
				page,
				password: "Abcdefghijk2",
				confirmPassword: "Abcdefghijk2",
			});
			await expect(
				page.getByText(/Password must contain at least one special character/),
			).toBeVisible();
		});

		await test.step("Enter mismatched passwords", async () => {
			await enterPassword({
				page,
				password: "Password123!",
				confirmPassword: "Password321!",
			});
			await expect(page.getByText("Passwords don't match")).toBeVisible();
		});
	});
});
