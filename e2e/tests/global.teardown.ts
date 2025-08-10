import { execSync } from "node:child_process";

async function globalTeardown() {
	console.log("🧹 Tearing down test data...");
	// TODO: make an api call that tears down data, with secured credentials
	// OR trigger AWS Lambda function that tears down data
	execSync("docker compose exec test-server python scripts/teardown_e2e.py", {
		stdio: "inherit",
	});
}

export default globalTeardown;
