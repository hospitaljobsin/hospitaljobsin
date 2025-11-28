import { Feed, type Item } from 'feed';
import { fetchPosts } from '@/lib/cms';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
	const feed = new Feed({
		title: 'Hospital Pulse',
		description:
			'Explore expert career advice, industry trends, and insights for healthcare professionals and recruiters. Stay informed with the latest in healthcare employment.',
		id: env.NEXT_PUBLIC_URL,
		link: `${env.NEXT_PUBLIC_URL}${links.blog}`,
		language: 'en',
		favicon: `${env.NEXT_PUBLIC_URL}/favicon.ico`,
		copyright: `All rights reserved ${new Date().getFullYear()},  ${APP_NAME}`,
		updated: new Date(),
		feedLinks: {
			rss2: `${env.NEXT_PUBLIC_URL}${links.blogFeed}`
		},
		generator: APP_NAME
	});

	try {
		const { docs: posts } = await fetchPosts({ limit: 50 });

		for (const post of posts) {
			const item: Item = {
				title: post.title,
				id: `${env.NEXT_PUBLIC_URL}${links.blogDetail(post.slug)}`,
				link: `${env.NEXT_PUBLIC_URL}${links.blogDetail(post.slug)}`,
				description: post.meta?.description || '',
				date: new Date(post.publishedAt || post.updatedAt),
				image: post.heroImage?.url
			};
			if (post.populatedAuthors?.[0]) {
				item.author = [{ name: post.populatedAuthors[0].name }];
			}
			feed.addItem(item);
		}
	} catch (error) {
		// If CMS fetch fails, return empty feed rather than failing the build
		console.warn('Failed to fetch posts for RSS feed:', error);
	}

	return new Response(feed.rss2(), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
}
