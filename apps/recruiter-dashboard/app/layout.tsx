import CookieBanner from "@/components/CookieBanner";
import PostHogIdentifier from "@/components/PostHogIdentifier";
import { env } from "@/lib/env/client";
import "@copilotkit/react-ui/styles.css";
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Providers from "./providers";

const workSans = Work_Sans({
	variable: "--font-work-sans",
	subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_URL),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersPromise = headers();
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${workSans.variable} antialiased h-full w-full`}>
				{/* Workaround to fix navigation scroll issues */}
				<div />
				<Providers headersPromise={headersPromise}>
					<PostHogIdentifier />
					<CookieBanner />
					{children}
				</Providers>
			</body>
		</html>
	);
}
