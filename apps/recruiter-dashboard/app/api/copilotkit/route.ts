import { env } from "@/lib/env/client";
import { getEnv } from "@/lib/env/server";
import {
	CopilotRuntime,
	LangChainAdapter,
	copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { ChatGoogle } from "@langchain/google-webauth";
import type { NextRequest } from "next/server";

let _serviceAdapter: LangChainAdapter | null = null;

async function getServiceAdapter() {
	if (!_serviceAdapter) {
		const env = await getEnv();
		const genai = new ChatGoogle({
			model: env.GOOGLE_GEMINI_MODEL,
			apiKey: env.GOOGLE_API_KEY,
			maxReasoningTokens: 10,
			apiVersion: "v1beta",
			platformType: "gai",
		});

		_serviceAdapter = new LangChainAdapter({
			chainFn: async ({ messages, tools }) => {
				return genai.bindTools(tools).stream(messages);
			},
		});
	}
	return _serviceAdapter;
}

const runtime = new CopilotRuntime({
	remoteEndpoints: [
		{
			url: `${env.NEXT_PUBLIC_API_URL}/copilotkit`,
		},
	],
});

export const POST = async (req: NextRequest) => {
	const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
		runtime,
		serviceAdapter: await getServiceAdapter(),
		endpoint: "/api/copilotkit",
	});

	return handleRequest(req);
};
