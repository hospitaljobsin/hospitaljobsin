import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { Work_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import CookieBanner from '@/components/CookieBanner';
import PostHogIdentifier from '@/components/PostHogIdentifier';
import { ReactScan } from '@/components/ReactScanComponent';
import { APP_DESCRIPTION, APP_TITLE } from '@/lib/constants';
import { env } from '@/lib/env/client';
import './globals.css';
import Providers from './providers';

const workSans = Work_Sans({
	variable: '--font-work-sans',
	subsets: ['latin'],
	display: 'swap'
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
	},

	robots: {
		follow: true,
		index: true,
		nocache: false,
		googleBot: {
			follow: true,
			index: true
		}
	},
	other: {
		bingbot: ['index, follow']
	}
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#000000' }
	]
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
			{env.NEXT_PUBLIC_ENVIRONMENT === 'production' && <GoogleTagManager gtmId='GTM-TKGSDM8M' />}
			<body className={`${workSans.variable} antialiased light relative`}>
				<Providers headersPromise={headersPromise}>
					<PostHogIdentifier />
					<CookieBanner />
					{children}
				</Providers>
			</body>
		</html>
	);
}
