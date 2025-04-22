import { TESTER_EMAIL } from "@/tests/utils/constants";
import { test as setup } from "@playwright/test";
import { waitForCaptcha } from "./utils/captcha";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
	// Navigate to login page
	await page.goto("http://localhost:5002/auth/login");
	// Wait for recaptcha to load
	await waitForCaptcha({ page });
	await page.getByLabel("Email Address").fill(TESTER_EMAIL);
	await page
		.getByRole("textbox", { name: "Password Password" })
		.fill("Password123!");
	await page.getByRole("button", { name: "Log in" }).click();
	// Wait until the page receives the cookies.
	//
	// Sometimes login flow sets cookies in the process of several redirects.
	// Wait for the final URL to ensure that the cookies are actually set.
	await page.waitForURL("http://localhost:5000/");

	await page.context().storageState({ path: authFile });
});
