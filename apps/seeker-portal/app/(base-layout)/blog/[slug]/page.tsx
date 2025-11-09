import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { BlogPosting, WithContext } from 'schema-dts';
import { BlogPostDetail } from '@/components/blog/BlogPostDetail';
import DashboardHeaderClientComponent from '@/components/layout/DashboardHeaderClientComponent';
import { fetchPostBySlug } from '@/lib/cms';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';

interface BlogPostPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await fetchPostBySlug(slug);

	if (!post) {
		return {
			title: 'Post Not Found',
			description: 'The requested blog post could not be found.'
		};
	}

	// Use SEO metadata from Payload CMS if available, with fallbacks
	const metaTitle = post.meta?.title || post.title;
	const metaDescription = post.meta?.description || `Read ${post.title} on ${APP_NAME}`;
	const metaImage = post.meta?.image?.url || post.heroImage?.url;

	// Construct the canonical URL
	const canonicalUrl = `${env.NEXT_PUBLIC_URL}${links.blogDetail(slug)}`;

	// Get author information for article metadata
	const authors = post.populatedAuthors?.map(author => ({
		name: author.name
	}));

	// Format published date for article metadata
	const publishedTime = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;

	return {
		title: metaTitle,
		description: metaDescription,
		keywords: post.categories?.map(cat => cat.title).join(', '),
		authors: authors,
		creator: authors?.[0]?.name,
		publisher: APP_NAME,
		alternates: {
			canonical: canonicalUrl
		},
		openGraph: {
			title: metaTitle,
			description: metaDescription,
			url: canonicalUrl,
			siteName: APP_NAME,
			images: metaImage
				? [
						{
							url: metaImage,
							width: post.meta?.image?.width || post.heroImage?.width || 1200,
							height: post.meta?.image?.height || post.heroImage?.height || 630,
							alt: post.meta?.image?.alt || post.heroImage?.alt || post.title
						}
					]
				: [],
			locale: 'en_US',
			type: 'article',
			publishedTime: publishedTime,
			authors: authors?.map(author => author.name),
			tags: post.categories?.map(cat => cat.title)
		},
		twitter: {
			card: 'summary_large_image',
			title: metaTitle,
			description: metaDescription,
			images: metaImage ? [metaImage] : [],
			creator: authors?.[0]?.name ? `@${authors[0].name}` : undefined
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
}

async function BlogPostContent({ slug }: { slug: string }) {
	const post = await fetchPostBySlug(slug);

	if (!post) {
		notFound();
	}

	// Generate JSON-LD structured data for better SEO using schema-dts
	const jsonLd: WithContext<BlogPosting> = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.meta?.title || post.title,
		description: post.meta?.description || `Read ${post.title} on Hospital Jobs`,
		image: post.meta?.image?.url || post.heroImage?.url,
		datePublished: post.publishedAt,
		dateModified: post.publishedAt,
		author: post.populatedAuthors?.map(author => ({
			'@type': 'Person',
			name: author.name,
			...(author.about && { description: author.about }),
			...(author.avatar?.url && { image: author.avatar.url })
		})),
		publisher: {
			'@type': 'Organization',
			name: APP_NAME,
			logo: {
				'@type': 'ImageObject',
				url: `${env.NEXT_PUBLIC_URL}/logo.png`
			}
		},
		...(post.readingTime && {
			timeRequired: `PT${post.readingTime}M`
		}),
		...(post.categories &&
			post.categories.length > 0 && {
				keywords: post.categories.map(cat => cat.title).join(', ')
			}),
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${env.NEXT_PUBLIC_URL}${links.blogDetail(slug)}`
		}
	};

	return (
		<>
			{/* Add JSON-LD structured data */}
			<script
				type='application/ld+json'
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<BlogPostDetail post={post} />
		</>
	);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;

	return (
		<div className='w-full h-full flex flex-col'>
			<DashboardHeaderClientComponent />
			<div className='container mx-auto px-4 py-8'>
				<BlogPostContent slug={slug} />
			</div>
		</div>
	);
}
