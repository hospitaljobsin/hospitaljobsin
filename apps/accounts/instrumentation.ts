// instrumentation.ts

import { loadSecrets } from "./lib/secrets";

export function register() {
	if (typeof window === "undefined") {
		// load secrets only on the server
		loadSecrets().catch((err) => {
			console.error("Failed to load secrets", err);
			process.exit(1);
		});
	}
}
