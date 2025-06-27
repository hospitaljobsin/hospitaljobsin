import type { Environment } from "react-relay";
import { createClientEnvironment } from "./client";
import { createServerEnvironment } from "./server";

const IS_SERVER = typeof window === typeof undefined;

let _clientEnvironment: null | Environment = null;

export function getCurrentEnvironment() {
	console.log("IS_SERVER", IS_SERVER);
	console.log("getting a new environment");
	if (IS_SERVER) {
		return createServerEnvironment();
	}

	if (!_clientEnvironment) {
		_clientEnvironment = createClientEnvironment();
	}
	return _clientEnvironment;
}
