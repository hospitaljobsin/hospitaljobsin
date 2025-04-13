"use client";
import { env } from "@/lib/env";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { RelayEnvironmentProvider } from "react-relay";

export default function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [environment] = useState(() => {
		return getCurrentEnvironment();
	});

	return (
		<HeroUIProvider navigate={router.push}>
			<ToastProvider placement="bottom-left" toastOffset={15} />
			<ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
				<RelayEnvironmentProvider environment={environment}>
					<GoogleReCaptchaProvider
						reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
						useRecaptchaNet
						container={{
							parameters: {
								badge: "inline",
							},
						}}
					>
						<ProgressProvider
							height="4px"
							color="hsl(var(--heroui-primary-400))"
							nonce="progressbar-nonce"
							options={{ showSpinner: false }}
							shallowRouting
						>
							{children}
						</ProgressProvider>
					</GoogleReCaptchaProvider>
				</RelayEnvironmentProvider>
			</ThemeProvider>
		</HeroUIProvider>
	);
}
