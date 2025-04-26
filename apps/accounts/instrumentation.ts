// instrumentation.ts

import { initializeEnv } from "./lib/env/server";

export async function register() {
	if (typeof window === "undefined") {
		// load secrets only on the server
		await initializeEnv();
	}
}
