import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Article, BreadcrumbList, FAQPage, Organization, WithContext } from 'schema-dts';
import { BlogPostDetail } from '@/components/blog/BlogPostDetail';
import DashboardHeaderClientComponent from '@/components/layout/DashboardHeaderClientComponent';
import { fetchPostBySlug, fetchPosts } from '@/lib/cms';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

interface BlogPostPageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
	try {
		// Fetch all published posts to generate static pages
		const postsData = await fetchPosts({ limit: 1000 });

		return postsData.docs.map(post => ({
			slug: post.slug
		}));
	} catch (error) {
		console.error('Error generating static params for blog posts:', error);
		// Return empty array to avoid build failure
		return [];
	}
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

	// Format published and modified dates for article metadata
	const publishedTime = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
	const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined;

	return {
		title: metaTitle,
		description: metaDescription,
		keywords: post.meta?.keywords || post.categories?.map(cat => cat.title).join(', '),
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
			modifiedTime: modifiedTime,
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

	// Calculate word count from content
	const wordCount = post.content
		? JSON.stringify(post.content)
				.replace(/<[^>]*>/g, '')
				.split(/\s+/)
				.filter(word => word.length > 0).length
		: undefined;

	// Extract FAQ blocks from content for FAQPage schema
	const faqBlocks: Array<{ question: string; answer: string }> = [];
	if (post.content?.root?.children) {
		const extractFAQs = (nodes: any[]): void => {
			nodes.forEach(node => {
				if (node.type === 'block' && node.fields?.blockType === 'faq') {
					const faqs = node.fields.faqs as Array<{ question: string; answer: string }>;
					if (faqs) {
						faqBlocks.push(...faqs);
					}
				}
				if (node.children) {
					extractFAQs(node.children);
				}
			});
		};
		extractFAQs(post.content.root.children);
	}

	// Generate JSON-LD structured data for better SEO using schema-dts
	const articleSchema: WithContext<Article> = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.meta?.title || post.title,
		description: post.meta?.description || `Read ${post.title} on Hospital Jobs`,
		image: post.meta?.image?.url || post.heroImage?.url,
		datePublished: post.publishedAt,
		dateModified: post.updatedAt || post.publishedAt,
		author: post.populatedAuthors?.map(author => ({
			'@type': 'Person',
			name: author.name,
			...(author.about && { description: author.about }),
			...(author.credentials && { jobTitle: author.credentials }),
			...(author.avatar?.url && { image: author.avatar.url })
		})),
		...(post.populatedReviewer && {
			reviewedBy: {
				'@type': 'Person',
				name: post.populatedReviewer.name,
				...(post.populatedReviewer.credentials && { jobTitle: post.populatedReviewer.credentials })
			}
		}),
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
		...(wordCount && { wordCount }),
		...(post.categories &&
			post.categories.length > 0 && {
				keywords: post.categories.map(cat => cat.title).join(', '),
				articleSection: post.categories[0].title
			}),
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${env.NEXT_PUBLIC_URL}${links.blogDetail(slug)}`
		}
	};

	const breadcrumbSchema: WithContext<BreadcrumbList> = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: env.NEXT_PUBLIC_URL
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Blog',
				item: `${env.NEXT_PUBLIC_URL}/blog`
			},
			...(post.categories && post.categories.length > 0
				? [
						{
							'@type': 'ListItem',
							position: 3,
							name: post.categories[0].title,
							item: `${env.NEXT_PUBLIC_URL}${links.blog}?category=${post.categories[0].slug}`
						},
						{
							'@type': 'ListItem',
							position: 4,
							name: post.title,
							item: `${env.NEXT_PUBLIC_URL}${links.blogDetail(slug)}`
						}
					]
				: [
						{
							'@type': 'ListItem',
							position: 3,
							name: post.title,
							item: `${env.NEXT_PUBLIC_URL}${links.blogDetail(slug)}`
						}
					])
		]
	};

	const organizationSchema: WithContext<Organization> = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: APP_NAME,
		url: env.NEXT_PUBLIC_URL,
		logo: `${env.NEXT_PUBLIC_URL}/logo.png`,
		sameAs: [
			// Add social media profiles here when available
		]
	};

	const faqPageSchema: WithContext<FAQPage> | null =
		faqBlocks.length > 0
			? {
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: faqBlocks.map(faq => ({
						'@type': 'Question',
						name: faq.question,
						acceptedAnswer: {
							'@type': 'Answer',
							text: faq.answer
						}
					}))
				}
			: null;

	return (
		<>
			{/* Add JSON-LD structured data */}
			<script
				type='application/ld+json'
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
			/>
			<script
				type='application/ld+json'
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
			<script
				type='application/ld+json'
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
			/>
			{faqPageSchema && (
				<script
					type='application/ld+json'
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
				/>
			)}
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
