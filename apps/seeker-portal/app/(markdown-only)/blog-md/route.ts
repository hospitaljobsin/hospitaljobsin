import { fetchPosts } from '@/lib/cms';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';

export async function GET() {
	const postsData = await fetchPosts({ limit: 50 });
	const blogUrl = `${env.NEXT_PUBLIC_URL}${links.blog}`;

	const postsList = postsData.docs
		.map(post => {
			const categories = post.categories?.map(cat => cat.title).join(', ') || 'Uncategorized';
			const authors = post.populatedAuthors?.map(a => a.name).join(', ') || 'Unknown';
			const publishedDate = post.publishedAt
				? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
				: 'Not specified';

			return `### [${post.title}](${env.NEXT_PUBLIC_URL}${links.blogDetail(post.slug)})

**Published:** ${publishedDate} | **Reading Time:** ${post.readingTime || 'N/A'} min
**Categories:** ${categories} | **Authors:** ${authors}

${post.meta?.description || ''}`;
		})
		.join('\n\n---\n\n');

	const markdown = `Title: Hospital Pulse - Healthcare Career Insights & Industry Trends

URL Source: ${blogUrl}

Markdown Content:
[](${env.NEXT_PUBLIC_URL} "Visit ${APP_NAME} home page")

# Hospital Pulse

Career insights, industry trends, and expert advice for healthcare professionals and recruiters

---

## Latest Articles

${postsList}
`;

	return new Response(markdown.trim(), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
	});
}
