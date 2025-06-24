import {
	CopilotRuntime,
	GoogleGenerativeAIAdapter,
	copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

import type { NextRequest } from "next/server";

const serviceAdapter = new GoogleGenerativeAIAdapter({
	model: "gemini-2.5-flash-lite-preview-06-17",
});
const runtime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
	const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
		runtime,
		serviceAdapter,
		endpoint: "/api/copilotkit",
	});

	return handleRequest(req);
};
