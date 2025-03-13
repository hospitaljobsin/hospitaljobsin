import { expect, test } from "@playwright/test";
// import { mockRecaptcha } from "../../utils/recaptcha";

test.describe("Login Page", () => {
	test.beforeEach(async ({ page }) => {
		// Setup mock for recaptcha
		// await mockRecaptcha(page);

		// Navigate to login page
		await page.goto("/auth/login");
		// Wait for recaptcha to load
		await page.waitForFunction(
			() =>
				typeof window.grecaptcha !== "undefined" && window.grecaptcha.execute,
		);
	});

	test("should display login form with all elements", async ({ page }) => {
		// Check page title
		await expect(page).toHaveTitle(/Login/);

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
	});

	test("should validate empty form submission", async ({ page }) => {
		// Submit without entering data
		await page.getByRole("button", { name: "Log in" }).click();

		// Check validation messages
		await expect(
			page.getByText("This field is required").first(),
		).toBeVisible();
		await expect(page.getByText("This field is required").nth(1)).toBeVisible();
	});

	test("should validate email format", async ({ page }) => {
		// Enter invalid email
		await page.getByLabel("Email Address").fill("invalid-email");
		await page
			.getByRole("textbox", { name: "Password Password" })
			.fill("password123");
		await page.getByRole("button", { name: "Log in" }).click();

		// Check validation message
		await expect(page.getByText("Invalid email")).toBeVisible();
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
		await page.getByLabel("Email Address").fill("tester@example.org");
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

		// TODO: this error arises because recaptcha is not loaded
		// but this works when we click manually
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

	// test("should handle successful login", async ({ page }) => {
	// 	// Mock the GraphQL response for successful login
	// 	await page.route("**/graphql", async (route) => {
	// 		const json = route.request().postDataJSON();
	// 		if (json.operationName === "LoginFormPasswordMutation") {
	// 			await route.fulfill({
	// 				status: 200,
	// 				contentType: "application/json",
	// 				body: JSON.stringify({
	// 					data: {
	// 						loginWithPassword: {
	// 							__typename: "Account",
	// 						},
	// 					},
	// 				}),
	// 			});
	// 		} else {
	// 			await route.continue();
	// 		}
	// 	});

	// 	// Fill form with valid credentials
	// 	await page.getByLabel("Email Address").fill("valid@example.com");
	// 	await page.getByRole("textbox", { name: "Password Password" }).fill("correctpassword");
	// 	await page.getByRole("button", { name: "Log in" }).click();

	// 	// Should redirect (since we're testing locally without actual redirection)
	// 	// Just check that form submission completes without errors
	// 	await expect(
	// 		page.getByRole("button", { name: "Log in" }),
	// 	).not.toBeDisabled();
	// });

	// test("should handle 2FA requirement", async ({ page }) => {
	// 	// Mock the GraphQL response for 2FA requirement
	// 	await page.route("**/graphql", async (route) => {
	// 		const json = route.request().postDataJSON();
	// 		if (json.operationName === "LoginFormPasswordMutation") {
	// 			await route.fulfill({
	// 				status: 200,
	// 				contentType: "application/json",
	// 				body: JSON.stringify({
	// 					data: {
	// 						loginWithPassword: {
	// 							__typename: "TwoFactorAuthenticationRequiredError",
	// 							message: "2FA required",
	// 						},
	// 					},
	// 				}),
	// 			});
	// 		} else {
	// 			await route.continue();
	// 		}
	// 	});

	// 	// Fill form with credentials that require 2FA
	// 	await page.getByLabel("Email Address").fill("2fa@example.com");
	// 	await page.getByRole("textbox", { name: "Password Password" }).fill("password123");
	// 	await page.getByRole("button", { name: "Log in" }).click();

	// 	// Should redirect to 2FA page
	// 	await expect(page).toHaveURL(/\/two-factor-authentication/);
	// });

	// test("should handle passkey authentication", async ({ page }) => {
	// 	// Mock the GraphQL responses for passkey flow
	// 	await page.route("**/graphql", async (route) => {
	// 		const json = route.request().postDataJSON();

	// 		if (
	// 			json.operationName === "LoginFormGenerateAuthenticationOptionsMutation"
	// 		) {
	// 			await route.fulfill({
	// 				status: 200,
	// 				contentType: "application/json",
	// 				body: JSON.stringify({
	// 					data: {
	// 						generateAuthenticationOptions: {
	// 							__typename: "GenerateAuthenticationOptionsSuccess",
	// 							authenticationOptions: JSON.stringify({
	// 								challenge: "mockChallenge",
	// 								timeout: 60000,
	// 								rpId: "localhost",
	// 								allowCredentials: [],
	// 							}),
	// 						},
	// 					},
	// 				}),
	// 			});
	// 		} else {
	// 			await route.continue();
	// 		}
	// 	});

	// 	// Mock WebAuthn API
	// 	await page.addInitScript(() => {
	// 		window.navigator.credentials = {
	// 			get: () =>
	// 				Promise.resolve({
	// 					id: "mockCredentialId",
	// 					type: "public-key",
	// 					response: {
	// 						authenticatorData: "mockAuthenticatorData",
	// 						clientDataJSON: "mockClientDataJSON",
	// 						signature: "mockSignature",
	// 					},
	// 				}),
	// 		};
	// 	});

	// 	// Click passkey button
	// 	await page.getByRole("button", { name: "Sign in with passkey" }).click();

	// 	// Check that button shows loading state
	// 	await expect(
	// 		page.getByRole("button", { name: "Sign in with passkey" }),
	// 	).toBeDisabled();
	// });

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

	// test("should handle invalid authentication provider error", async ({
	// 	page,
	// }) => {
	// 	// Mock the GraphQL response for invalid auth provider
	// 	await page.route("**/graphql", async (route) => {
	// 		const json = route.request().postDataJSON();
	// 		if (json.operationName === "LoginFormPasswordMutation") {
	// 			await route.fulfill({
	// 				status: 200,
	// 				contentType: "application/json",
	// 				body: JSON.stringify({
	// 					data: {
	// 						loginWithPassword: {
	// 							__typename: "InvalidAuthenticationProviderError",
	// 							message: "Invalid authentication provider",
	// 							availableProviders: ["OAUTH_GOOGLE"],
	// 						},
	// 					},
	// 				}),
	// 			});
	// 		} else {
	// 			await route.continue();
	// 		}
	// 	});

	// 	// Fill form
	// 	await page.getByLabel("Email Address").fill("google-user@example.com");
	// 	await page.getByRole("textbox", { name: "Password Password" }).fill("password123");
	// 	await page.getByRole("button", { name: "Log in" }).click();

	// 	// Check toast message
	// 	await expect(page.getByText("Invalid Sign In Method")).toBeVisible();
	// 	await expect(
	// 		page.getByText(/You've previously signed in with Google/),
	// 	).toBeVisible();
	// });
});
