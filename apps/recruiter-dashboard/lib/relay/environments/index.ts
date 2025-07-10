import type { Environment } from "react-relay";
import { createClientEnvironment } from "./client";

const IS_SERVER = typeof window === typeof undefined;

let _clientEnvironment: null | Environment = null;

export function getCurrentEnvironment() {
	console.log("getting a new environment");
	if (IS_SERVER) {
		const { createServerEnvironment } = require("./server");
		return createServerEnvironment();
	}

	if (_clientEnvironment === null) {
		_clientEnvironment = createClientEnvironment();
	}
	return _clientEnvironment;
}
