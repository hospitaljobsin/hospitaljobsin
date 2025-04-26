// instrumentation.ts

import { loadSecrets } from "./lib/secrets";

export function register() {
	loadSecrets().catch((err) => {
		console.error("Failed to load secrets", err);
		process.exit(1);
	});
}
