import { Suspense } from 'react';
import { BlogPostList } from '@/components/blog/BlogPostList';
import { BlogPostsSkeleton } from '@/components/blog/BlogPostsSkeleton';
import { fetchPosts } from '@/lib/cms';

async function BlogPosts() {
	const postsData = await fetchPosts({ limit: 50 });

	return <BlogPostList posts={postsData.docs} />;
}

export default function BlogPage() {
	return (
		<div className='container mx-auto px-4 py-8 max-w-7xl'>
			<div className='mb-8'>
				<h1 className='text-4xl font-bold mb-2'>Blog</h1>
				<p className='text-lg text-default-500'>Insights, news, and updates from Hospital Jobs</p>
			</div>

			<Suspense fallback={<BlogPostsSkeleton />}>
				<BlogPosts />
			</Suspense>
		</div>
	);
}
