import type { PayloadPost } from '@/types/payload';
import { BlogPostCard } from './BlogPostCard';

interface BlogPostListProps {
	posts: PayloadPost[];
}

export function BlogPostList({ posts }: BlogPostListProps) {
	if (posts.length === 0) {
		return (
			<div className='text-center py-12'>
				<p className='text-lg text-default-500'>No blog posts found.</p>
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{posts.map(post => (
				<BlogPostCard key={post.id} post={post} />
			))}
		</div>
	);
}
