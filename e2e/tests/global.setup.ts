import { env } from "@/lib/env";
import type { FullConfig } from "@playwright/test";
import { execSync } from "node:child_process";

async function globalSetup(config: FullConfig) {
	console.log("🌱 Seeding test data...");

	if (env.ENVIRONMENT === "staging") {
		console.log("🚀 Staging environment detected, skipping global setup...");
	} else {
		console.log(
			"🐳 Local environment detected, using Docker Compose for test database setup...",
		);
		execSync("docker compose exec test-server python scripts/setup_e2e.py", {
			stdio: "inherit",
		});
	}
}

export default globalSetup;
