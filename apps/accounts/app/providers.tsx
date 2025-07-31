"use client";
import { TurnstileProvider } from "@/components/TurnstileProvider";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";

export default function Providers({
	children,
	nonce,
}: {
	children: React.ReactNode;
	nonce: string;
}) {
	const router = useRouter();
	const environment = useMemo(() => {
		return getCurrentEnvironment();
	}, []);

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
								{children}
							</ProgressProvider>
						</TurnstileProvider>
					</RelayEnvironmentProvider>
				</ThemeProvider>
			</HeroUIProvider>
		</NavigationGuardProvider>
	);
}
