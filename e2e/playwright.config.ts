import { defineConfig, devices } from "@playwright/test";

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
		baseURL: "http://localhost:5002",

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on",
	},

	globalSetup: require.resolve("./tests/global.setup.ts"),
	globalTeardown: require.resolve("./tests/global.teardown.ts"),

	expect: {
		timeout: IS_CI ? 35_000 : 30_000,
	},

	timeout: IS_CI ? 60_000 : 45_000,

	/* Configure projects for major browsers */
	projects: [
		// Setup project
		{ name: "setup", testMatch: /.*\.setup\.ts/ },
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
			dependencies: ["setup"],
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
			dependencies: ["setup"],
		},

		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
			dependencies: ["setup"],
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
	// 	url: "http://localhost:5002",
	// 	reuseExistingServer: true,
	// 	timeout: 120 * 1000,
	// },
});
