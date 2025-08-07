import CookieBanner from "@/components/CookieBanner";
import PostHogIdentifier from "@/components/PostHogIdentifier";
import Footer from "@/components/layout/Footer";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
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
	const headersPromise = headers();
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${workSans.variable} antialiased`}>
				{/* Workaround to fix navigation scroll issues */}
				<div />
				<Providers headersPromise={headersPromise}>
					<PostHogIdentifier />
					<CookieBanner />
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
