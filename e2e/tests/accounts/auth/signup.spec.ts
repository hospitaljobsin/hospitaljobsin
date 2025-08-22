import { env } from "@/lib/env";
import { authTest, expect, test } from "@/playwright/fixtures";
import { waitForCaptcha } from "@/tests/utils/captcha";
import { EMAIL_VERIFICATION_TOKEN_COOLDOWN } from "@/tests/utils/constants";
import type { Email } from "@/tests/utils/emails";
import {
	findLastEmail,
	generateUniqueEmail,
	registerEmailAddress,
} from "@/tests/utils/emails";
import type { PlaywrightTestArgs } from "@playwright/test";

async function findVerificationCode({
	emailMessage,
	context,
}: {
	emailMessage: Email;
	context: PlaywrightTestArgs["context"];
}): Promise<string> {
	if (!emailMessage.html) {
		throw new Error("Email message not found");
	}

	const emailPage = await context.newPage();
	await emailPage.setContent(emailMessage.html);

	const verificationCode = await emailPage.evaluate(() => {
		const codeElement = document.querySelector(".btn-primary h1");
		return codeElement?.textContent?.trim() || "";
	});
	await emailPage.close();
	return verificationCode;
}

test.describe("Sign Up Page", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to login page
		await page.goto(`${env.ACCOUNTS_UI_BASE_URL}/auth/signup`);
		// Wait for recaptcha to load
		await waitForCaptcha({ page });
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
			page.getByText(/This site is protected by Cloudflare Turnstile/),
		).toBeVisible();
		await expect(page.getByText("Cloudflare Privacy Policy")).toBeVisible();
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
				.filter({ hasText: /^Invalid email address$/ })
				.first(),
		).toBeVisible();
	});

	test("should validate email availability", async ({ page }) => {
		await test.step("Enter email address with invalid domain", async () => {
			// Enter invalid email
			await page
				.getByLabel("Email Address")
				.fill("new-emailtester@example.org");

			await page.getByRole("button", { name: "Continue" }).click();

			// Check validation message
			await expect(
				page
					.locator("div")
					.filter({
						hasText: /The domain name example.org does not accept email/,
					})
					.first(),
			).toBeVisible();
		});

		await test.step("Enter email address with nonexistent domain", async () => {
			// Enter invalid email
			await page
				.getByLabel("Email Address")
				.fill("new-emailtester@example.nonexistent");

			await page.getByRole("button", { name: "Continue" }).click();

			// Check validation message
			await expect(
				page
					.locator("div")
					.filter({
						hasText: /The domain name example.nonexistent does not exist/,
					})
					.first(),
			).toBeVisible();
		});
	});

	test("should redirect successfully to Google accounts page on Google signup", async ({
		page,
		browserName,
	}) => {
		test.skip(
			browserName === "webkit",
			"Webkit cancels navigation due to content policies",
		);
		await page.getByRole("button", { name: "Sign up with Google" }).click();

		await page.waitForURL("https://accounts.google.com/**");
	});

	test("should validate invalid email verification token", async ({ page }) => {
		const emailAddress = await generateUniqueEmail("new-tester");
		await registerEmailAddress({ email: emailAddress });
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

		await page.waitForSelector("input[readonly]", { state: "visible" });
		await expect(page.getByLabel("Email Address")).toHaveAttribute("readonly");
		await expect(page.getByLabel("Email Verification Token")).toBeVisible();

		// Step 2: Get verification code from email
		const emailMessage = await findLastEmail({
			request,
			timeout: 10_000,
			inboxAddress: emailAddress,
			filter: (e) => e.subject.includes("Email Verification Request"),
		});

		expect(emailMessage).not.toBeNull();
		if (!emailMessage) {
			throw new Error("Email message not found");
		}
		const verificationCode = await findVerificationCode({
			emailMessage,
			context,
		});

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
			.getByRole("textbox", { name: "Password", exact: true })
			.fill(password);
		await page
			.getByRole("textbox", { name: "Confirm Password" })
			.fill(confirmPassword);
		await page.getByRole("button", { name: "Create account" }).click();
	}

	test("should successfully register with valid password", async ({
		page,
		request,
		context,
	}) => {
		const emailAddress = "valid-password-tester@outlook.com";
		await completeSteps1To3({ page, request, context, emailAddress });

		await test.step("Step 4: Enter valid password", async () => {
			await enterPassword({
				page,
				password: "Password123!",
				confirmPassword: "Password123!",
			});
			await page.waitForURL(`${env.SEEKER_PORTAL_BASE_URL}/`);
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

	test("should successfully register with valid passkey", async ({
		page,
		request,
		context,
		browserName,
	}) => {
		test.skip(browserName !== "chromium", "Only supported in Chromium");

		const emailAddress = "valid-passkey-tester@outlook.com";
		await completeSteps1To3({ page, request, context, emailAddress });

		await test.step("Step 4: Enter valid passkey", async () => {
			test.setTimeout(30_000);
			// Set up Chrome DevTools Protocol session
			const client = await context.newCDPSession(page);
			await client.send("WebAuthn.enable");

			// Add virtual authenticator with correct options
			const { authenticatorId } = await client.send(
				"WebAuthn.addVirtualAuthenticator",
				{
					options: {
						protocol: "ctap2",
						transport: "internal",
						hasResidentKey: true,
						hasUserVerification: true,
						isUserVerified: true,
						automaticPresenceSimulation: false,
					},
				},
			);

			// Confirm there are currently no registered credentials
			const result1 = await client.send("WebAuthn.getCredentials", {
				authenticatorId,
			});
			expect(result1.credentials).toHaveLength(0);

			const operationCompleted = new Promise<void>((resolve) => {
				client.on("WebAuthn.credentialAdded", () => resolve());
				client.on("WebAuthn.credentialAsserted", () => resolve());
			});

			// set automaticPresenceSimulation option to true
			// (so that the virtual authenticator will respond to the next passkey prompt)
			await client.send("WebAuthn.setAutomaticPresenceSimulation", {
				authenticatorId: authenticatorId,
				enabled: true,
			});

			await page.getByRole("button", { name: "Create account" }).click();

			// wait to receive the event that the passkey was successfully registered or verified
			await operationCompleted;

			// set automaticPresenceSimulation option back to false
			await client.send("WebAuthn.setAutomaticPresenceSimulation", {
				authenticatorId,
				enabled: false,
			});

			// Confirm the passkey was successfully registered
			const result2 = await client.send("WebAuthn.getCredentials", {
				authenticatorId,
			});
			expect(result2.credentials).toHaveLength(1);

			await page.waitForURL(`${env.SEEKER_PORTAL_BASE_URL}/`);
		});
	});

	test("should register with invalid passkey", async ({
		page,
		request,
		context,
		browserName,
	}) => {
		test.skip(browserName !== "chromium", "Only supported in Chromium");

		const emailAddress = "invalid-passkey-tester@outlook.com";
		await completeSteps1To3({ page, request, context, emailAddress });

		await test.step("Step 4: Enter invalid passkey", async () => {
			test.setTimeout(30_000);
			// Set up Chrome DevTools Protocol session
			const client = await context.newCDPSession(page);
			await client.send("WebAuthn.enable");

			// Add virtual authenticator with correct options
			const { authenticatorId } = await client.send(
				"WebAuthn.addVirtualAuthenticator",
				{
					options: {
						protocol: "ctap2",
						transport: "internal",
						hasResidentKey: true,
						hasUserVerification: true,
						isUserVerified: true,
						automaticPresenceSimulation: false,
					},
				},
			);

			// Confirm there are currently no registered credentials
			const result1 = await client.send("WebAuthn.getCredentials", {
				authenticatorId,
			});
			expect(result1.credentials).toHaveLength(0);

			// set isUserVerified option to false
			// (so that subsequent passkey operations will fail)
			await client.send("WebAuthn.setUserVerified", {
				authenticatorId: authenticatorId,
				isUserVerified: false,
			});

			// set automaticPresenceSimulation option to true
			// (so that the virtual authenticator will respond to the next passkey prompt)
			await client.send("WebAuthn.setAutomaticPresenceSimulation", {
				authenticatorId: authenticatorId,
				enabled: true,
			});

			await page.getByRole("button", { name: "Create account" }).click();

			// wait for an expected UI change that indicates the passkey operation has completed
			await expect(
				page.getByRole("button", { name: "Create account" }),
			).toBeVisible();

			// set automaticPresenceSimulation option back to false
			await client.send("WebAuthn.setAutomaticPresenceSimulation", {
				authenticatorId,
				enabled: false,
			});

			// Confirm the passkey was not registered
			const result2 = await client.send("WebAuthn.getCredentials", {
				authenticatorId,
			});
			expect(result2.credentials).toHaveLength(0);
		});
	});

	test("should handle cooldown on multiple email verification requests", async ({
		page,
		request,
	}) => {
		// increase timeout to incorporate cooldown
		test.setTimeout(45_000);
		const emailAddress = await generateUniqueEmail("new-tester2");
		await registerEmailAddress({ email: emailAddress });

		// First email verification request

		await page.getByLabel("Email Address").fill(emailAddress);
		await page.getByRole("button", { name: "Continue" }).click();

		// wait for second step to load
		await expect(page.getByLabel("Email Verification Token")).toBeVisible();

		const firstEmail = await findLastEmail({
			request,
			timeout: 10_000,
			inboxAddress: emailAddress,
			filter: (e) => e.subject.includes("Email Verification Request"),
		});

		expect(firstEmail).not.toBeNull();
		if (!firstEmail) {
			throw new Error("First email not found");
		}

		// Navigate to signup page
		await page.goto(`${env.ACCOUNTS_UI_BASE_URL}/auth/signup`);
		// Wait for recaptcha to load
		await waitForCaptcha({ page });

		// Second email verification request immediately after
		await page.getByLabel("Email Address").fill(emailAddress);
		await page.getByRole("button", { name: "Continue" }).click();

		// wait for second step to load
		await expect(page.getByLabel("Email Verification Token")).toBeVisible();

		const secondEmail = await findLastEmail({
			request,
			timeout: 3_000,
			inboxAddress: emailAddress,
			filter: (e) => e.subject.includes("Email Verification Request"),
		});

		// Ensure no second email was sent due to rate limit
		expect(secondEmail).not.toBeNull();
		if (!secondEmail) {
			throw new Error("Second email not found");
		}
		expect(secondEmail.id).toEqual(firstEmail.id);

		// Wait for cooldown and try again (after testing env rate limit expires)
		await page.waitForTimeout(EMAIL_VERIFICATION_TOKEN_COOLDOWN);

		// Navigate to reset password page
		// Navigate to signup page
		await page.goto(`${env.ACCOUNTS_UI_BASE_URL}/auth/signup`);
		// Wait for recaptcha to load
		await waitForCaptcha({ page });

		await page.getByLabel("Email Address").fill(emailAddress);
		await page.getByRole("button", { name: "Continue" }).click();

		// wait for second step to load
		await expect(page.getByLabel("Email Verification Token")).toBeVisible();

		const thirdEmail = await findLastEmail({
			request,
			timeout: 10_000,
			inboxAddress: emailAddress,
			filter: (e) => e.subject.includes("Email Verification Request"),
		});

		// Confirm third attempt succeeded after rate limit expired
		expect(thirdEmail).not.toBeNull();
		if (!thirdEmail) {
			throw new Error("Third email not found");
		}
		expect(thirdEmail.id).not.toEqual(firstEmail.id);
	});
});

authTest.describe("Sign Up Page Authentication Redirects", () => {
	authTest(
		"should redirect to home page when already authenticated",
		async ({ page }) => {
			await page.goto(`${env.ACCOUNTS_UI_BASE_URL}/auth/signup`);
			await page.waitForURL(`${env.SEEKER_PORTAL_BASE_URL}/`);
		},
	);
});
