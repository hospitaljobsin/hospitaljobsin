import {
	BedrockAdapter,
	CopilotRuntime,
	copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

import type { NextRequest } from "next/server";

const serviceAdapter = new BedrockAdapter({ model: "us.amazon.nova-pro-v1:0" });

const runtime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
	const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
		runtime,
		serviceAdapter,
		endpoint: "/api/copilotkit",
	});

	return handleRequest(req);
};
