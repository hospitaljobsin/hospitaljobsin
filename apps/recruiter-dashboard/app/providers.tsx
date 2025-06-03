"use client";
import { HeadersProvider } from "@/components/HeadersProvider";
import { env } from "@/lib/env/client";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { CopilotKit } from "@copilotkit/react-core";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RelayEnvironmentProvider } from "react-relay";

export default function Providers({
	children,
	headersPromise,
}: { children: React.ReactNode; headersPromise: Promise<ReadonlyHeaders> }) {
	const router = useRouter();
	const [environment] = useState(() => {
		return getCurrentEnvironment();
	});

	return (
		<HeroUIProvider navigate={router.push}>
			<ToastProvider placement="bottom-left" toastOffset={15} />
			<ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
				<RelayEnvironmentProvider environment={environment}>
					<CopilotKit
						runtimeUrl={env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL}
						// publicApiKey={publicApiKey}
						agent={env.NEXT_PUBLIC_COPILOTKIT_AGENT_NAME}
					>
						<ProgressProvider
							height="4px"
							color="hsl(var(--heroui-primary-300))"
							nonce="progressbar-nonce"
							options={{ showSpinner: false }}
							shallowRouting
						>
							<HeadersProvider headersPromise={headersPromise}>
								{children}
							</HeadersProvider>
						</ProgressProvider>
					</CopilotKit>
				</RelayEnvironmentProvider>
			</ThemeProvider>
		</HeroUIProvider>
	);
}
