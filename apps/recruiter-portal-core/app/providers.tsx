"use client";
import { HeadersProvider } from "@/components/HeadersProvider";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { useRouter } from "next/navigation";
import { use, useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import invariant from "tiny-invariant";

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
	invariant(nonce, "Nonce is required");

	return (
		<HeroUIProvider navigate={router.push}>
			<ToastProvider placement="bottom-left" toastOffset={15} />
			<ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
				<RelayEnvironmentProvider environment={environment}>
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
				</RelayEnvironmentProvider>
			</ThemeProvider>
		</HeroUIProvider>
	);
}
