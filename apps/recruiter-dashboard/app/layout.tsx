import {
	APP_NAME,
	APP_TAGLINE,
	ORG_SUBDOMAIN_HEADER_NAME,
} from "@/lib/constants";
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { headers } from "next/headers";
import invariant from "tiny-invariant";
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
	description: APP_TAGLINE,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const organizationSlug = headersList.get(ORG_SUBDOMAIN_HEADER_NAME);

	invariant(organizationSlug, "Organization slug is required in headers");
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${workSans.variable} antialiased h-full w-full`}>
				<Providers organizationSlug={organizationSlug}>{children}</Providers>
			</body>
		</html>
	);
}
