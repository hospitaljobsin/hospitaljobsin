import { Work_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Providers from "./providers";

const workSans = Work_Sans({
	variable: "--font-work-sans",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersPromise = headers();
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${workSans.variable} antialiased h-full w-full`}>
				<Providers headersPromise={headersPromise}>{children}</Providers>
			</body>
		</html>
	);
}
