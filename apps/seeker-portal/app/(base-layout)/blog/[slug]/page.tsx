import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BlogPostDetail } from '@/components/blog/BlogPostDetail';
import { BlogPostSkeleton } from '@/components/blog/BlogPostSkeleton';
import { fetchPostBySlug } from '@/lib/cms';

interface BlogPostPageProps {
	params: Promise<{
		slug: string;
	}>;
}

async function BlogPostContent({ slug }: { slug: string }) {
	const post = await fetchPostBySlug(slug);

	if (!post) {
		notFound();
	}

	return <BlogPostDetail post={post} />;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;

	return (
		<div className='container mx-auto px-4 py-8'>
			<Suspense fallback={<BlogPostSkeleton />}>
				<BlogPostContent slug={slug} />
			</Suspense>
		</div>
	);
}
