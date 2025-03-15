import { execSync } from "child_process";

async function globalTeardown() {
    console.log("🧹 Tearing down test data...");
    execSync("docker compose exec test-server uv run scripts/teardown_e2e_database.py", {
      stdio: "inherit",
    });
}

export default globalTeardown;