"use client";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { TurnstileProvider } from "@/components/TurnstileProvider";
import { getCurrentEnvironment } from "@/lib/relay/environments";

export default function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [environment] = useState(() => {
		return getCurrentEnvironment();
	});

	return (
		<HeroUIProvider navigate={router.push}>
			<ToastProvider placement="bottom-left" toastOffset={15} />
			<ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
				<RelayEnvironmentProvider environment={environment}>
					<TurnstileProvider>
						<ProgressProvider
							height="4px"
							color="hsl(var(--heroui-primary-300))"
							nonce="progressbar-nonce"
							options={{ showSpinner: false }}
							shallowRouting
						>
							{children}
						</ProgressProvider>
					</TurnstileProvider>
				</RelayEnvironmentProvider>
			</ThemeProvider>
		</HeroUIProvider>
	);
}
