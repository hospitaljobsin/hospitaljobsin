import { env } from "@/lib/env";
import { execSync } from "node:child_process";

async function globalTeardown() {
	console.log("🧹 Tearing down test data...");

	if (env.ENVIRONMENT === "staging") {
		console.log("🚀 Staging environment detected, skipping global teardown...");
	} else {
		console.log(
			"🐳 Local environment detected, using Docker Compose for test database teardown...",
		);
		execSync("docker compose exec test-server python scripts/teardown_e2e.py", {
			stdio: "inherit",
		});
	}
}

export default globalTeardown;
