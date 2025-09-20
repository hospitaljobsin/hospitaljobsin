import CookieBanner from '@/components/CookieBanner';
import Footer from '@/components/layout/Footer';
import PostHogIdentifier from '@/components/PostHogIdentifier';
import { ReactScan } from '@/components/ReactScanComponent';
import { APP_DESCRIPTION, APP_TITLE } from '@/lib/constants';
import { env } from '@/lib/env/client';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import Providers from './providers';

const workSans = Work_Sans({
	variable: '--font-work-sans',
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: {
		template: `%s | ${APP_TITLE}`,
		default: APP_TITLE
	},
	description: APP_DESCRIPTION,
	metadataBase: new URL(env.NEXT_PUBLIC_URL),
	alternates: {
		canonical: './'
	}
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersPromise = headers();
	return (
		<html lang='en' suppressHydrationWarning>
			<ReactScan />
			<body className={`${workSans.variable} antialiased light`}>
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
