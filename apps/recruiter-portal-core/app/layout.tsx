import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import CookieBanner from '@/components/CookieBanner';
import Footer from '@/components/layout/Footer';
import PostHogIdentifier from '@/components/PostHogIdentifier';
import { ReactScan } from '@/components/ReactScanComponent';
import { APP_TAGLINE, APP_TITLE } from '@/lib/constants';
import { env } from '@/lib/env/client';
import './globals.css';
import Providers from './providers';

const workSans = Work_Sans({
	variable: '--font-work-sans',
	subsets: ['latin'],
	display: 'swap'
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: APP_TITLE,
	description: APP_TAGLINE,
	metadataBase: new URL(env.NEXT_PUBLIC_URL),
	keywords: [
		'healthcare recruiting platform',
		'hospital recruiter software',
		'medical staffing solution',
		'healthcare talent acquisition',
		'hospital recruitment tool',
		'hospital hiring platform'
	],
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
			<body className={`${workSans.variable} antialiased h-full w-full`}>
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
