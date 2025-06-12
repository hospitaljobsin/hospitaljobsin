import { env } from "@/lib/env/client";
import { getEnv } from "@/lib/env/server";
import {
	CopilotRuntime,
	GoogleGenerativeAIAdapter,
	copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextRequest } from "next/server";

let _serviceAdapter: GoogleGenerativeAIAdapter | null = null;

async function getServiceAdapter() {
	if (!_serviceAdapter) {
		const env = await getEnv();
		const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);
		_serviceAdapter = new GoogleGenerativeAIAdapter({
			model: env.GOOGLE_GEMINI_MODEL,
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
