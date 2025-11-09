'use client';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { format } from 'date-fns';
import { CalendarDays, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { PayloadPost } from '@/types/payload';

interface BlogPostCardProps {
	post: PayloadPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
	const publishedDate = post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : null;
	const authors = post.populatedAuthors || [];
	const authorNames = authors.map(author => author.name).join(', ');

	return (
		<Card as={Link} href={`/blog/${post.slug}`} className='group transition-all duration-300' isPressable shadow='none'>
			{post.heroImage?.url && (
				<CardHeader className='p-0 overflow-hidden'>
					<div className='relative w-full h-64'>
						<Image
							src={post.heroImage.url}
							alt={post.heroImage.alt || post.title}
							fill
							className='object-cover group-hover:scale-105 transition-transform duration-300'
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							priority={false}
						/>
					</div>
				</CardHeader>
			)}
			<CardBody className='gap-2'>
				<h2 className='text-lg font-medium line-clamp-2'>{post.title}</h2>
				{post.meta?.description && <p className='text-sm text-default-500 line-clamp-3'>{post.meta.description}</p>}
			</CardBody>
			<CardFooter className='gap-4 flex-col items-start pt-0'>
				<div className='flex gap-4 text-xs text-default-400'>
					{publishedDate && (
						<div className='flex items-center gap-1'>
							<CalendarDays className='w-3 h-3' />
							<span>{publishedDate}</span>
						</div>
					)}
					{authorNames && (
						<div className='flex items-center gap-1'>
							<User className='w-3 h-3' />
							<span>{authorNames}</span>
						</div>
					)}
				</div>
				{post.categories && post.categories.length > 0 && (
					<div className='flex gap-2 flex-wrap'>
						{post.categories.map(category => (
							<span key={category.id} className='text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-600'>
								{category.title}
							</span>
						))}
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
