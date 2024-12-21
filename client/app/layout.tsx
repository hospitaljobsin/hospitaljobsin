import type { AuthProviderQuery } from "@/components/__generated__/AuthProviderQuery.graphql";
import AuthProviderQueryNode from "@/components/__generated__/AuthProviderQuery.graphql";
import { APP_NAME } from "@/lib/constants";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
const workSans = Work_Sans({
	variable: "--font-work-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		template: `%s | ${APP_NAME}`,
		default: APP_NAME,
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// root auth query
	const preloadedQuery = await loadSerializableQuery<
		typeof AuthProviderQueryNode,
		AuthProviderQuery
	>(AuthProviderQueryNode.params, {});
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${workSans.variable} antialiased h-full`}>
				<Providers preloadedQuery={preloadedQuery}>{children}</Providers>
			</body>
		</html>
	);
}
