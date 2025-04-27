// instrumentation.ts

import { initializeEnv } from "./lib/env/server";

export function register() {
	if (typeof window === "undefined") {
		// load secrets only on the server
		initializeEnv().catch((error) => {
			console.error("Error initializing environment:", error);
		});
	}
}
