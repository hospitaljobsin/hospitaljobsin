import {
	TESTER_EMAIL,
	TWO_FACTOR_TESTER_1_EMAIL,
	WEBAUTHN_TESTER_EMAIL,
} from "@/tests/e2e/utils/constants";
import { expect, test } from "@playwright/test";

test.describe("Login Page", () => {
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
	});

	test("should display login form with all elements", async ({ page }) => {
		// Check page title
		await expect(page).toHaveTitle(/Login/);

		await expect(page.getByText(/Log in to continue/)).toBeVisible();

		// Check form elements
		await expect(page.getByLabel("Email Address")).toBeVisible();
		await expect(
			page.getByRole("textbox", { name: "Password Password" }),
		).toBeVisible();
		await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Sign in with passkey" }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Sign in with Google" }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Forgot password?" }),
		).toBeVisible();
		await expect(
			page.getByText("Don't have an account? Sign up."),
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
		await page.getByRole("button", { name: "Log in" }).click();

		// Check validation messages
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^This field is required$/ })
				.first(),
		).toBeVisible();
		await page
			.locator("div")
			.filter({ hasText: /^This field is required$/ })
			.nth(2)
			.click();
	});

	test("should validate email format", async ({ page }) => {
		// Enter invalid email
		await page.getByLabel("Email Address").fill("invalid-email");
		await page
			.getByRole("textbox", { name: "Password Password" })
			.fill("password123");
		await page.getByRole("button", { name: "Log in" }).click();

		// Check validation message
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^Invalid email$/ })
				.first(),
		).toBeVisible();
	});

	test("should toggle password visibility", async ({ page }) => {
		// Fill password field
		await page
			.getByRole("textbox", { name: "Password Password" })
			.fill("password123");

		// Initially password should be hidden (type="password")
		await expect(
			page.getByRole("textbox", { name: "Password Password" }),
		).toHaveAttribute("type", "password");

		// Click the eye icon to show password
		await page
			.getByRole("button", { name: "toggle password visibility" })
			.click();

		// Password should now be visible (type="text")
		await expect(
			page.getByRole("textbox", { name: "Password Password" }),
		).toHaveAttribute("type", "text");

		// Click again to hide
		await page
			.getByRole("button", { name: "toggle password visibility" })
			.click();

		// Password should be hidden again
		await expect(
			page.getByRole("textbox", { name: "Password Password" }),
		).toHaveAttribute("type", "password");
	});

	test("should handle invalid credentials", async ({ page }) => {
		// Fill form with invalid credentials
		await page.getByLabel("Email Address").fill(TESTER_EMAIL);
		await page
			.getByRole("textbox", { name: "Password Password" })
			.fill("invalidpassword");

		// Click the login button
		await page.getByRole("button", { name: "Log in" }).click();

		// Now check for error messages
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^Invalid credentials provided\.$/ })
				.first(),
		).toBeVisible();
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^Invalid credentials provided\.$/ })
				.nth(2),
		).toBeVisible();
	});

	test("should navigate to sign up page", async ({ page }) => {
		// increase timeout to incorporate navigation
		test.setTimeout(30_000);
		// Click on sign up link
		await page.getByRole("link", { name: /Sign up/ }).click();

		// Verify navigation
		await expect(page).toHaveURL(/\/auth\/signup/);
	});

	test("should navigate to forgot password page", async ({ page }) => {
		// increase timeout to incorporate navigation
		test.setTimeout(30_000);
		// Click on forgot password link
		await page.getByRole("link", { name: "Forgot password?" }).click();

		// Verify navigation
		await expect(page).toHaveURL(/\/auth\/reset-password/);
	});

	test("should handle successful email-password login", async ({ page }) => {
		// Fill form with valid credentials
		await page.getByLabel("Email Address").fill(TESTER_EMAIL);
		await page
			.getByRole("textbox", { name: "Password Password" })
			.fill("Password123!");
		await page.getByRole("button", { name: "Log in" }).click();

		await page.waitForURL("http://localhost:5000/");
	});

	test("should redirect on 2FA requirement", async ({ page }) => {
		// Fill form with credentials that require 2FA
		await page.getByLabel("Email Address").fill(TWO_FACTOR_TESTER_1_EMAIL);
		await page
			.getByRole("textbox", { name: "Password Password" })
			.fill("Password123!");
		await page.getByRole("button", { name: "Log in" }).click();

		// Should redirect to 2FA page
		await page.waitForURL("http://localhost:5002/auth/2fa");
	});

	test("should handle successful passkey login", async ({
		page,
		context,
		browserName,
	}) => {
		test.skip(browserName !== "chromium", "Only supported in Chromium");
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

		// Register a mock credential
		await client.send("WebAuthn.addCredential", {
			authenticatorId,
			credential: {
				credentialId: "4KwTS6Y6Hzd7L6ijwZd2Mg==", // Base64-encoded mock credential ID
				isResidentCredential: true,
				privateKey:
					"MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgaXHR/cXGj5XEgk3jpoqK50mry/3gOFAyQwgXRNSz+ZyhRANCAAR9WkpjDhNVmt1JxiXmdtXFV9X46pefmf2zU5AzFPczSLtppVXd9i2gzKClvkenoESvvdOaF299W1Gp8TESeQpx", // Base64-encoded mock private key (COSE later if needed)
				rpId: "localhost",
				userHandle: "YPG5s7Ozs7Ozs7Oz", // Ensure it's 16 bytes (padded)
				signCount: 0,
			},
		});

		const credentials = await client.send("WebAuthn.getCredentials", {
			authenticatorId,
		});

		// Ensure the credential was added successfully
		expect(credentials.credentials).toHaveLength(1);

		// initialize event listeners to wait for a successful passkey input event
		const operationCompleted = new Promise<void>((resolve) => {
			client.on("WebAuthn.credentialAdded", () => resolve());
			client.on("WebAuthn.credentialAsserted", () => resolve());
		});

		// set isUserVerified option to true
		// (so that subsequent passkey operations will be successful)
		await client.send("WebAuthn.setUserVerified", {
			authenticatorId: authenticatorId,
			isUserVerified: true,
		});

		// set automaticPresenceSimulation option to true
		// (so that the virtual authenticator will respond to the next passkey prompt)
		await client.send("WebAuthn.setAutomaticPresenceSimulation", {
			authenticatorId: authenticatorId,
			enabled: true,
		});

		// Click passkey button to trigger authentication
		await page.getByRole("button", { name: "Sign in with passkey" }).click();

		// wait to receive the event that the passkey was successfully registered or verified
		await operationCompleted;

		// set automaticPresenceSimulation option back to false
		await client.send("WebAuthn.setAutomaticPresenceSimulation", {
			authenticatorId,
			enabled: false,
		});

		// Ensure redirection happens after successful authentication
		await page.waitForURL("http://localhost:5000/");
	});

	test("should handle invalid passkey login", async ({
		page,
		context,
		browserName,
	}) => {
		test.skip(browserName !== "chromium", "Only supported in Chromium");
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

		const credentials = await client.send("WebAuthn.getCredentials", {
			authenticatorId,
		});

		// Ensure we have no credentials
		expect(credentials.credentials).toHaveLength(0);

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

		// Click passkey button to trigger authentication
		await page.getByRole("button", { name: "Sign in with passkey" }).click();

		// wait for an expected UI change that indicates the passkey operation has completed
		await expect(
			page.getByRole("button", { name: "Sign in with passkey" }),
		).toBeVisible();

		// set automaticPresenceSimulation option back to false
		await client.send("WebAuthn.setAutomaticPresenceSimulation", {
			authenticatorId,
			enabled: false,
		});
	});

	test("should handle OAuth2 error from URL parameter", async ({ page }) => {
		// increase timeout to incorporate navigation
		test.setTimeout(30_000);
		// Navigate to login page with OAuth2 error
		await page.goto("/auth/login?oauth2_error=unverified_email");

		// Check error message is displayed
		await expect(
			page.getByText("Please verify your email before signing in."),
		).toBeVisible();
	});

	test("should handle invalid authentication provider error", async ({
		page,
	}) => {
		// Fill form
		await page.getByLabel("Email Address").fill(WEBAUTHN_TESTER_EMAIL);
		await page
			.getByRole("textbox", { name: "Password Password" })
			.fill("Password123!");
		await page.getByRole("button", { name: "Log in" }).click();

		// Check toast message
		await expect(page.getByText("Invalid Sign In Method")).toBeVisible();
		await expect(page.getByText(/Please sign in with passkey./)).toBeVisible();
	});

	test("should redirect successfully to Google accounts page on Google login", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Sign in with Google" }).click();

		await page.waitForURL("https://accounts.google.com/**");
	});
});

test.describe("Login Page Authentication Redirects", () => {
	test.use({ storageState: "../../../playwright/.auth/user.json" });

	test("should redirect to home page when already authenticated", async ({
		page,
	}) => {
		await page.goto("/auth/login");
		await page.waitForURL("http://localhost:5000/");
	});
});
