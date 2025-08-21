import { defineConfig, devices } from "@playwright/test";
import { getBasicAuthHeaders, isBasicAuthConfigured } from "./lib/basic-auth";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const IS_CI = process.env.CI;

export default defineConfig({
	testDir: "./tests/",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!IS_CI,
	retries: IS_CI ? 1 : 0,
	/* Opt out of parallel tests on CI. */
	workers: IS_CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: IS_CI ? "dot" : "list",
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on",

		// Add basic auth headers to all requests if configured
		...(isBasicAuthConfigured() && {
			extraHTTPHeaders: getBasicAuthHeaders(),
		}),
	},

	globalSetup: require.resolve("./tests/global.setup.ts"),
	globalTeardown: require.resolve("./tests/global.teardown.ts"),

	expect: {
		timeout: IS_CI ? 45_000 : 35_000,
	},

	timeout: IS_CI ? 60_000 : 50_000,

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				contextOptions: {
					// chromium-specific permissions
					permissions: ["clipboard-read", "clipboard-write"],
					ignoreHTTPSErrors: true,
				},
			},
		},

		{
			name: "firefox",
			use: {
				...devices["Desktop Firefox"],
				contextOptions: {
					ignoreHTTPSErrors: true,
				},
				launchOptions: {
					firefoxUserPrefs: {
						"dom.events.testing.asyncClipboard": true,
						"dom.events.asyncClipboard.readText": true,
						"dom.events.asyncClipboard.clipboardItem": true,
						"dom.events.asyncClipboard.writeText": true,
						"permissions.default.clipboard-read": 1,
						"permissions.default.clipboard-write": 1,
						"security.enterprise_roots.enabled": true, // Enable for testing with self-signed certificates
					},
				},
			},
		},

		{
			name: "webkit",
			use: {
				...devices["Desktop Safari"],
				contextOptions: {
					ignoreHTTPSErrors: true,
				},
			},
		},

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	// 	command: "pnpm start",
	// 	reuseExistingServer: true,
	// 	timeout: 120 * 1000,
	// },
});
