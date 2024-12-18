import { APP_NAME } from "@/lib/constants";
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${workSans.variable} antialiased h-full`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
