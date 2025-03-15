import type { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

async function globalSetup(config: FullConfig) {
    console.log("🌱 Seeding test data...");
    execSync("docker compose exec test-server python scripts/setup_e2e_database.py", {
      stdio: "inherit",
    });
}

export default globalSetup;