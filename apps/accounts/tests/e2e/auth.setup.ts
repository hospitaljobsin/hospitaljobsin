import { test as setup } from "@playwright/test";
import path from "node:path";

const authFile = path.join(__dirname, "../../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
	// Perform authentication steps. Replace these actions with your own.
	await page.goto("/auth/login");
	await page.getByLabel("Email Address").fill("tester@example.org");
	await page
		.getByRole("textbox", { name: "Password Password" })
		.fill("Password123!");
	await page.getByRole("button", { name: "Log in" }).click();
	// Wait until the page receives the cookies.
	//
	// Sometimes login flow sets cookies in the process of several redirects.
	// Wait for the final URL to ensure that the cookies are actually set.
	await page.waitForURL("http://localhost:5000/");
	// Alternatively, you can wait until the page reaches a state where all cookies are set.
	// await expect(
	// 	page.getByRole("button", { name: "View profile and more" }),
	// ).toBeVisible();

	// End of authentication steps.

	await page.context().storageState({ path: authFile });
});
