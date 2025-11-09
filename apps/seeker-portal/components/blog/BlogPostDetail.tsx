'use client';

import { Chip } from '@heroui/react';
import { format } from 'date-fns';
import { CalendarDays, User } from 'lucide-react';
import Link from 'next/link';
import type { PayloadPost } from '@/types/payload';
import { CMSImage } from './CMSImage';
import { LexicalContent } from './LexicalContent';

interface BlogPostDetailProps {
	post: PayloadPost;
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
	const publishedDate = post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : null;
	const authors = post.populatedAuthors || [];
	const authorNames = authors.map(author => author.name).join(', ');

	return (
		<article className='max-w-4xl mx-auto'>
			{/* Hero Image */}
			{post.heroImage?.url && (
				<div className='relative w-full h-[400px] mb-8 rounded-lg overflow-hidden'>
					<CMSImage
						src={post.heroImage.url}
						alt={post.heroImage.alt || post.title}
						fill
						className='object-cover'
						sizes='(max-width: 1200px) 100vw, 1200px'
						priority
					/>
				</div>
			)}

			{/* Categories */}
			{post.categories && post.categories.length > 0 && (
				<div className='flex gap-2 flex-wrap mb-4'>
					{post.categories.map(category => (
						<Chip key={category.id} color='primary' variant='flat'>
							{category.title}
						</Chip>
					))}
				</div>
			)}

			{/* Title */}
			<h1 className='text-4xl md:text-5xl font-bold mb-4'>{post.title}</h1>

			{/* Meta Information */}
			<div className='flex gap-4 text-sm text-default-500 mb-8 pb-8 border-b border-default-200'>
				{publishedDate && (
					<div className='flex items-center gap-2'>
						<CalendarDays className='w-4 h-4' />
						<span>{publishedDate}</span>
					</div>
				)}
				{authorNames && (
					<div className='flex items-center gap-2'>
						<User className='w-4 h-4' />
						<span>By {authorNames}</span>
					</div>
				)}
			</div>

			{/* Content */}
			{post.content && <LexicalContent content={post.content} />}

			{/* Back to Blog Link */}
			<div className='mt-12 pt-8 border-t border-default-200'>
				<Link href='/blog' className='text-primary hover:underline'>
					← Back to all posts
				</Link>
			</div>
		</article>
	);
}
