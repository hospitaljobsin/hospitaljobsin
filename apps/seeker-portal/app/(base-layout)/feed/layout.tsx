import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';

export const metadata: Metadata = {
	title: `RSS Feed - Subscribe to Healthcare Career Updates | ${APP_NAME}`,
	description: `Subscribe to our RSS feed for the latest healthcare career insights, medical job opportunities, industry trends, and professional development tips. Stay updated with ${APP_NAME} blog content.`,
	keywords: [
		'RSS feed',
		'healthcare careers RSS',
		'medical jobs feed',
		'healthcare blog subscription',
		'nursing career updates',
		'doctor job alerts',
		'healthcare industry news',
		'medical professional resources',
		'hospital jobs RSS',
		'healthcare employment feed'
	],
	alternates: {
		canonical: `${env.NEXT_PUBLIC_URL}${links.feed}`,
		types: {
			'application/rss+xml': `${env.NEXT_PUBLIC_URL}${links.blogFeed}`
		}
	},
	openGraph: {
		title: `Subscribe to ${APP_NAME} RSS Feed`,
		description: `Get the latest healthcare career insights, industry trends, and job market updates delivered directly to your feed reader. Subscribe to ${APP_NAME} RSS feed.`,
		url: `${env.NEXT_PUBLIC_URL}${links.feed}`,
		siteName: APP_NAME,
		type: 'website',
		locale: 'en_US'
	},
	twitter: {
		card: 'summary',
		title: `Subscribe to ${APP_NAME} RSS Feed`,
		description: 'Get healthcare career insights and job updates delivered to your feed reader. Subscribe to our RSS feed.'
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true
		}
	}
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
	return children;
}
