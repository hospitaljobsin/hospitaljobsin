import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BlogPostList } from '@/components/blog/BlogPostList';
import { BlogPostsSkeleton } from '@/components/blog/BlogPostsSkeleton';
import DashboardHeaderClientComponent from '@/components/layout/DashboardHeaderClientComponent';
import { fetchPosts } from '@/lib/cms';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';

export const metadata: Metadata = {
	title: 'Hospital Pulse - Healthcare Career Insights & Industry Trends',
	description:
		'Explore expert career advice, industry trends, and insights for healthcare professionals and recruiters. Stay informed with the latest in healthcare employment.',
	keywords:
		'healthcare careers, hospital jobs, medical employment, healthcare industry trends, career advice, healthcare professionals, medical recruiting',
	alternates: {
		canonical: `${env.NEXT_PUBLIC_URL}${links.blog}`
	},
	openGraph: {
		title: 'Hospital Pulse - Healthcare Career Insights & Industry Trends',
		description:
			'Explore expert career advice, industry trends, and insights for healthcare professionals and recruiters. Stay informed with the latest in healthcare employment.',
		url: `${env.NEXT_PUBLIC_URL}${links.blog}`,
		siteName: APP_NAME,
		locale: 'en_US',
		type: 'website',
		images: [
			{
				url: `${env.NEXT_PUBLIC_URL}/og-blog.png`,
				width: 1200,
				height: 630,
				alt: 'Hospital Pulse Blog'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Hospital Pulse - Healthcare Career Insights & Industry Trends',
		description: 'Explore expert career advice, industry trends, and insights for healthcare professionals and recruiters.',
		images: [`${env.NEXT_PUBLIC_URL}/og-blog.png`]
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1
		}
	}
};

async function BlogPosts() {
	const postsData = await fetchPosts({ limit: 50 });

	return <BlogPostList posts={postsData.docs} />;
}

export default function BlogPage() {
	return (
		<>
			<DashboardHeaderClientComponent />
			<div className='container mx-auto px-4 py-8 max-w-7xl'>
				<div className='mb-8'>
					<h1 className='text-xl sm:text-4xl font-medium tracking-tight mb-2'>Hospital Pulse</h1>
					<p className='text-xs sm:text-lg text-default-500'>
						Career insights, industry trends, and expert advice for healthcare professionals and recruiters
					</p>
				</div>

				<Suspense fallback={<BlogPostsSkeleton />}>
					<BlogPosts />
				</Suspense>
			</div>
		</>
	);
}
