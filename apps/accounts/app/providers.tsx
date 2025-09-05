"use client";
import { HeadersProvider } from "@/components/HeadersProvider";
import { TurnstileProvider } from "@/components/TurnstileProvider";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { ThemeProvider } from "next-themes";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { useRouter } from "next/navigation";
import { use, useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";

export default function Providers({
	children,
	headersPromise,
}: {
	children: React.ReactNode;
	headersPromise: Promise<ReadonlyHeaders>;
}) {
	const router = useRouter();
	const environment = useMemo(() => {
		return getCurrentEnvironment();
	}, []);

	const headersList = use(headersPromise);
	const headersMap = new Map(headersList);

	const nonce = headersMap.get("x-nonce");

	return (
		<NavigationGuardProvider>
			<HeroUIProvider navigate={router.push}>
				<ToastProvider placement="bottom-left" toastOffset={15} />
				<ThemeProvider
					attribute="class"
					forcedTheme="light"
					enableSystem={false}
				>
					<RelayEnvironmentProvider environment={environment}>
						<TurnstileProvider nonce={nonce}>
							<ProgressProvider
								height="4px"
								color="hsl(var(--heroui-primary-300))"
								nonce={nonce}
								options={{ showSpinner: false }}
								shallowRouting
							>
								<HeadersProvider headersPromise={headersPromise}>
									{children}
								</HeadersProvider>
							</ProgressProvider>
						</TurnstileProvider>
					</RelayEnvironmentProvider>
				</ThemeProvider>
			</HeroUIProvider>
		</NavigationGuardProvider>
	);
}
