import { notFound } from 'next/navigation';
import { fetchPostBySlug } from '@/lib/cms';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import { lexicalToMarkdown } from '@/lib/lexical';
import links from '@/lib/links';

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);

	const post = await fetchPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const blogDetailUrl = `${env.NEXT_PUBLIC_URL}${links.blogDetail(slug)}`;
	const { markdown: contentMarkdown, headings } = post.content
		? lexicalToMarkdown(post.content)
		: { markdown: 'No content available', headings: [] };

	const authorsText =
		post.populatedAuthors
			?.map(author => {
				const parts = [author.name];
				if (author.credentials) parts.push(author.credentials);
				return parts.join(', ');
			})
			.join('; ') || 'Not specified';

	const categoriesText = post.categories?.map(cat => cat.title).join(', ') || 'Uncategorized';

	const tableOfContents =
		headings.length > 0
			? `## Table of Contents\n\n${headings.map(h => `${'  '.repeat(h.level - 1)}- [${h.text}](#${h.id})`).join('\n')}\n\n---\n\n`
			: '';

	const authorsSection =
		post.populatedAuthors && post.populatedAuthors.length > 0
			? `---\n\n## About the Author${post.populatedAuthors.length > 1 ? 's' : ''}\n\n${post.populatedAuthors.map(author => `### ${author.name}${author.credentials ? `, ${author.credentials}` : ''}\n\n${author.about || 'No bio available.'}`).join('\n\n')}\n\n`
			: '';

	const reviewerSection =
		post.populatedReviewers && post.populatedReviewers.length > 0
			? `---\n\n## Reviewed By\n\n### ${post.populatedReviewers[0].name}${post.populatedReviewers[0].credentials ? `, ${post.populatedReviewers[0].credentials}` : ''}\n\n${post.populatedReviewers[0].about || 'No bio available.'}\n\n`
			: '';

	const markdown = `Title: ${post.title}

URL Source: ${blogDetailUrl}

Markdown Content:
[](${env.NEXT_PUBLIC_URL} "Visit ${APP_NAME} home page")

# ${post.title}

**Published:** ${post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}
${
	post.updatedAt
		? `**Last Updated:** ${new Date(post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
`
		: ''
}**Reading Time:** ${post.readingTime ? `${post.readingTime} min` : 'Not specified'}
**Categories:** ${categoriesText}
**Authors:** ${authorsText}
${post.populatedReviewers && post.populatedReviewers.length > 0 ? `**Reviewed By:** ${post.populatedReviewers[0].name}${post.populatedReviewers[0].credentials ? `, ${post.populatedReviewers[0].credentials}` : ''}` : ''}

---

${tableOfContents}${contentMarkdown}
${authorsSection}${reviewerSection}`;

	return new Response(markdown.trim(), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
	});
}
