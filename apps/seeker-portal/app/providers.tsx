"use client";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState } from "react";
import { RelayEnvironmentProvider } from "react-relay";

export default function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [environment] = useState(() => {
		return getCurrentEnvironment();
	});

	return (
		<HeroUIProvider navigate={router.push}>
			<NuqsAdapter>
				<ToastProvider placement="bottom-left" toastOffset={15} />
				<ThemeProvider
					attribute="class"
					forcedTheme="light"
					enableSystem={false}
				>
					<RelayEnvironmentProvider environment={environment}>
						<ProgressProvider
							height="4px"
							color="hsl(var(--heroui-primary-300))"
							nonce="progressbar-nonce"
							options={{ showSpinner: false, positionUsing: "margin" }}
							shallowRouting={false}
							disableSameURL
							shouldCompareComplexProps
						>
							{children}
						</ProgressProvider>
					</RelayEnvironmentProvider>
				</ThemeProvider>
			</NuqsAdapter>
		</HeroUIProvider>
	);
}
