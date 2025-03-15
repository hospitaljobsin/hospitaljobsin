import { PlaywrightTestArgs, expect, test } from "@playwright/test";
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
		await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();

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

	async function completeSteps1To3({
		page,
		request,
		context,
		emailAddress,
	}: {
		page: PlaywrightTestArgs["page"];
		request: PlaywrightTestArgs["request"];
		context: PlaywrightTestArgs["context"];
		emailAddress: string;
	}) {
		// Step 1: Enter email and proceed
		await page.getByLabel("Email Address").fill(emailAddress);
		await page.getByRole("button", { name: "Continue" }).click();

		await expect(page.getByLabel("Email Address")).toHaveAttribute("readonly");
		await expect(page.getByLabel("Email Verification Token")).toBeVisible();

		// Step 2: Get verification code from email
		const emailMessage = await findLastEmail({
			request,
			timeout: 5000,
			filter: (e) => e.recipients.includes(`<${emailAddress}>`),
		});
		const emailPage = await context.newPage();
		await emailPage.goto(
			`http://localhost:1080/messages/${emailMessage.id}.html`,
		);

		const verificationCode = await emailPage.evaluate(() => {
			const codeElement = document.querySelector(".btn-primary h1");
			return codeElement?.textContent?.trim() || "";
		});
		await emailPage.close();

		await page
			.getByRole("textbox", { name: "Email Verification Token" })
			.fill(verificationCode);
		await page.getByRole("button", { name: "Continue" }).click();

		// Step 3: Enter full name
		await expect(page.getByLabel("Full Name")).toBeVisible();
		await page.getByLabel("Full Name").fill("Tester");
		await page.getByRole("button", { name: "Continue" }).click();

		await expect(
			page.getByText(/Passkeys are the new replacement for passwords/),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Create account" }),
		).toBeVisible();
	}

	async function enterPassword({
		page,
		password,
		confirmPassword,
	}: {
		password: string;
		confirmPassword: string;
		page: PlaywrightTestArgs["page"];
	}) {
		await page.getByRole("tab", { name: "Password" }).click();
		await page
			.getByRole("textbox", { name: "Password Password" })
			.fill(password);
		await page
			.getByRole("textbox", { name: "Confirm Password Confirm" })
			.fill(confirmPassword);
		await page.getByRole("button", { name: "Create account" }).click();
	}

	test("should successfully register with valid password", async ({
		page,
		request,
		context,
	}) => {
		const emailAddress = "new-tester@outlook.com";
		await completeSteps1To3({ page, request, context, emailAddress });

		await test.step("Step 4: Enter valid password", async () => {
			await enterPassword({
				page,
				password: "Password123!",
				confirmPassword: "Password123!",
			});
			await page.waitForURL("http://localhost:5000/");
		});
	});

	test("should fail with invalid password", async ({
		page,
		request,
		context,
	}) => {
		const emailAddress = "invalid-password-tester@outlook.com";
		await completeSteps1To3({ page, request, context, emailAddress });

		await test.step("Step 4: Enter short password", async () => {
			await enterPassword({ page, password: "123", confirmPassword: "123" });
			await expect(
				page.getByText("Password must be at least 8 characters long."),
			).toBeVisible();
		});

		await test.step("Step 4: Enter password without capital letters", async () => {
			await enterPassword({
				page,
				password: "abcdefghijk",
				confirmPassword: "abcdefghijk",
			});
			await expect(
				page.getByText("Password must contain at least one uppercase letter."),
			).toBeVisible();
		});

		await test.step("Step 4: Enter password without numbers", async () => {
			await enterPassword({
				page,
				password: "Abcdefghijk",
				confirmPassword: "Abcdefghijk",
			});
			await expect(
				page.getByText("Password must contain at least one number."),
			).toBeVisible();
		});

		await test.step("Step 4: Enter password without special letters", async () => {
			await enterPassword({
				page,
				password: "Abcdefghijk2",
				confirmPassword: "Abcdefghijk2",
			});
			await expect(
				page.getByText(/Password must contain at least one special character/),
			).toBeVisible();
		});

		await test.step("Step 4: Enter mismatched passwords", async () => {
			await enterPassword({
				page,
				password: "Password123!",
				confirmPassword: "Password321!",
			});
			await expect(page.getByText("Passwords don't match")).toBeVisible();
		});
	});
});

// TODO: test register with passkeys
