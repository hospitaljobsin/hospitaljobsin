import Footer from "@/components/layout/Footer";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
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
	description: APP_TAGLINE,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${workSans.variable} antialiased h-full w-full`}>
				<Providers>{children}</Providers>
				<Footer />
			</body>
		</html>
	);
}
