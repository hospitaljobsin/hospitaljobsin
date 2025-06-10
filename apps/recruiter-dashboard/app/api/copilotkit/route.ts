import { env } from "@/lib/env/client";
import {
	CopilotRuntime,
	ExperimentalEmptyAdapter,
	copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import type { NextRequest } from "next/server";
import { CustomHttpAgent } from "./custom-http-agent";

const serviceAdapter = new ExperimentalEmptyAdapter();

const agenticChatAgent = new CustomHttpAgent({
	url: `${env.NEXT_PUBLIC_API_URL}/fastagency/awp`,
});

const runtime = new CopilotRuntime({
	agents: {
		agenticChatAgent: agenticChatAgent,
	},
});

export const POST = async (req: NextRequest) => {
	const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
		runtime,
		serviceAdapter,
		endpoint: "/api/copilotkit",
	});

	return handleRequest(req);
};
