"use client";
import { AuthProvider } from "@/components/AuthProvider";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import type { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import { NextUIProvider } from "@nextui-org/react";
import { AppProgressBar } from "next-nprogress-bar";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import type AuthProviderQueryNode from "../components/__generated__/AuthProviderQuery.graphql";
import type { AuthProviderQuery as AuthProviderQueryType } from "../components/__generated__/AuthProviderQuery.graphql";

export default function Providers({
	children,
	preloadedQuery,
}: {
	children: React.ReactNode;
	preloadedQuery: SerializablePreloadedQuery<
		typeof AuthProviderQueryNode,
		AuthProviderQueryType
	>;
}) {
	const router = useRouter();
	const [environment] = useState(() => {
		return getCurrentEnvironment();
	});

	return (
		<NextUIProvider navigate={router.push}>
			<ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
				<RelayEnvironmentProvider environment={environment}>
					<AuthProvider preloadedQuery={preloadedQuery}>
						{children}
						<AppProgressBar
							height="4px"
							color="#00a925"
							options={{ showSpinner: false }}
							shallowRouting
						/>
					</AuthProvider>
				</RelayEnvironmentProvider>
			</ThemeProvider>
		</NextUIProvider>
	);
}
