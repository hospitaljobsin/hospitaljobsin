import type { FullConfig } from "@playwright/test";
import { execSync } from "node:child_process";

async function globalSetup(config: FullConfig) {
	console.log("🌱 Seeding test data...");
	// TODO: make an api call that sets up data, with secured credentials
	// OR trigger AWS Lambda function that sets up data
	execSync("docker compose exec test-server python scripts/setup_e2e.py", {
		stdio: "inherit",
	});
}

export default globalSetup;
