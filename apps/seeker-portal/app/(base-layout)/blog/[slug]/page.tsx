import { notFound } from 'next/navigation';
import { BlogPostDetail } from '@/components/blog/BlogPostDetail';
import DashboardHeaderClientComponent from '@/components/layout/DashboardHeaderClientComponent';
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
		<div className='w-full h-full flex flex-col'>
			<DashboardHeaderClientComponent />
			<div className='container mx-auto px-4 py-8'>
				<BlogPostContent slug={slug} />
			</div>
		</div>
	);
}
