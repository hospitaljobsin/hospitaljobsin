import { authTest, expect, test } from "@/playwright/fixtures";
import { generateValidOTP } from "@/tests/utils/authenticator";
import { waitForCaptcha } from "@/tests/utils/captcha";
import { TOTP_USER_SECRET } from "@/tests/utils/constants";
import { findLastEmail } from "@/tests/utils/mailcatcher";
import type { PlaywrightTestArgs } from "@playwright/test";

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
		.getByRole("textbox", { name: "New Password", exact: true })
		.fill(password);
	await page
		.getByRole("textbox", { name: "Confirm New Password" })
		.fill(confirmPassword);
	await page.getByRole("button", { name: "Reset Password" }).click();
}

test.describe("Confirm Password Reset Page", () => {
	test.beforeEach(async ({ page, request, passwordAuth }) => {
		// Navigate to reset password page
		await page.goto("http://accounts.localtest.me/auth/reset-password");
		// Wait for recaptcha to load
		await waitForCaptcha({ page });

		const emailAddress = passwordAuth.account.email;
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
		passwordAuth,
	}) => {
		// Check page title
		await expect(page).toHaveTitle(/Password Reset/);

		await expect(page.getByText(/Reset Your Password/)).toBeVisible();

		// Check form elements
		await expect(page.getByLabel("Email Address")).toHaveAttribute("readonly");
		await expect(page.getByLabel("Email Address")).toHaveValue(
			passwordAuth.account.email,
		);
		await expect(
			page.getByRole("textbox", { name: "New Password", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("textbox", { name: "Confirm New Password" }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Reset Password" }),
		).toBeVisible();

		// ensure recaptcha terms and conditions are visible
		await expect(
			page.getByText(/This site is protected by Cloudflare Turnstile/),
		).toBeVisible();
		await expect(page.getByText("Cloudflare Privacy Policy")).toBeVisible();
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
			.getByRole("textbox", { name: "New Password", exact: true })
			.fill("Password123!");
		await page
			.getByRole("textbox", { name: "Confirm New Password" })
			.fill("Password123!");
		await page.getByRole("button", { name: "Reset Password" }).click();

		await page.waitForURL("http://localtest.me/");
	});

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

test.describe("2FA Confirm Password Reset Page", () => {
	test.beforeEach(async ({ page, request, twoFactorAuth }) => {
		// Navigate to reset password page
		await page.goto("http://accounts.localtest.me/auth/reset-password");
		// Wait for recaptcha to load
		await waitForCaptcha({ page });

		const emailAddress = twoFactorAuth.account.email;
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

	test("should display 2FA form with all elements", async ({
		page,
		twoFactorAuth,
	}) => {
		// Check page title
		await expect(page).toHaveTitle(/Password Reset/);

		await expect(page.getByText(/Two Factor Authentication/)).toBeVisible();

		// Check form elements
		await expect(page.getByLabel("Email Address")).toHaveAttribute("readonly");
		await expect(page.getByLabel("Email Address")).toHaveValue(
			twoFactorAuth.account.email,
		);
		await expect(page.getByLabel("2FA Code")).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Verify Code" }),
		).toBeVisible();

		// ensure recaptcha terms and conditions are visible
		await expect(
			page.getByText(/This site is protected by Cloudflare Turnstile/),
		).toBeVisible();
		await expect(page.getByText("Cloudflare Privacy Policy")).toBeVisible();
	});

	test("should validate empty form submission", async ({ page }) => {
		await page.getByRole("button", { name: "Verify Code" }).click();

		// Check validation messages
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^This field is required$/ })
				.first(),
		).toBeVisible();
	});

	test("should successfully verify with 2FA code", async ({ page }) => {
		const otp = await generateValidOTP({
			totp_secret: TOTP_USER_SECRET,
		});
		await page.getByLabel("2FA Code").fill(otp);
		await page.getByRole("button", { name: "Verify Code" }).click();

		await expect(page.getByText(/Reset Your Password/)).toBeVisible();
	});

	test("should successfully verify with recovery code", async ({
		page,
		twoFactorAuth,
	}) => {
		await page
			.getByLabel("2FA Code")
			.fill(twoFactorAuth.account.recoveryCodes[0]);
		await page.getByRole("button", { name: "Verify Code" }).click();

		await expect(page.getByText(/Reset Your Password/)).toBeVisible();
	});

	test("should successfully reset password", async ({ page, request }) => {
		const otp = await generateValidOTP({
			totp_secret: TOTP_USER_SECRET,
		});
		await page.getByLabel("2FA Code").fill(otp);
		await page.getByRole("button", { name: "Verify Code" }).click();
		await expect(page.getByText(/Reset Your Password/)).toBeVisible();

		await page
			.getByRole("textbox", { name: "New Password", exact: true })
			.fill("Password123!");
		await page
			.getByRole("textbox", { name: "Confirm New Password" })
			.fill("Password123!");
		await page.getByRole("button", { name: "Reset Password" }).click();

		await page.waitForURL("http://localtest.me/");
	});

	test("should handle invalid password", async ({ page }) => {
		const otp = await generateValidOTP({
			totp_secret: TOTP_USER_SECRET,
		});
		await page.getByLabel("2FA Code").fill(otp);
		await page.getByRole("button", { name: "Verify Code" }).click();
		await expect(page.getByText(/Reset Your Password/)).toBeVisible();

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

test.describe("Confirm Password Reset Page Not Found", () => {
	test("should handle invalid password reset link", async ({ page }) => {
		await page.goto(
			"http://accounts.localtest.me/auth/reset-password/invalid-token",
		);

		await expect(page.getByText(/404 Not Found/)).toBeVisible();
	});
});

authTest.describe(
	"Confirm Password Reset Page Authentication Redirects",
	() => {
		authTest(
			"should not redirect to home page when already authenticated",
			async ({ page, request, passwordAuth }) => {
				// Navigate to reset password page
				await page.goto("http://accounts.localtest.me/auth/reset-password");
				// Wait for recaptcha to load
				await waitForCaptcha({ page });

				const emailAddress = passwordAuth.account.email;
				await page.getByLabel("Email Address").fill(emailAddress);
				await page
					.getByRole("button", { name: "Request Password Reset" })
					.click();

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

				await page.goto(
					`http://localhost:1080/messages/${emailMessage.id}.html`,
				);

				// Extract the reset password link
				const resetLink = await page.getAttribute(
					'a[href*="reset-password"]',
					"href",
				);

				expect(resetLink).not.toBeNull();

				await page.goto(resetLink);
				// ensure we are not redirected here
				await expect(page).not.toHaveURL("http://localtest.me/");
				await expect(page).toHaveURL(resetLink);
			},
		);
	},
);
