import { env } from "@/lib/env/client";
import {
	CopilotRuntime,
	copilotRuntimeNextJSAppRouterEndpoint,
	ExperimentalEmptyAdapter,
	langGraphPlatformEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

const serviceAdapter = new ExperimentalEmptyAdapter();

const runtime = new CopilotRuntime({
	remoteEndpoints: [
		langGraphPlatformEndpoint({
			deploymentUrl: env.NEXT_PUBLIC_LANGGRAPH_DEPLOYMENT_URL,
			// langsmithApiKey: process.env.LANGSMITH_API_KEY || "", // only used in LangGraph Platform deployments
			agents: [
				{
					name: env.NEXT_PUBLIC_COPILOTKIT_AGENT_NAME,
					description: "A helpful LLM agent.",
				},
			],
		}),
	],
});

export const POST = async (req: NextRequest) => {
	const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
		runtime,
		serviceAdapter,
		endpoint: "/api/copilotkit",
	});

	return handleRequest(req);
};
