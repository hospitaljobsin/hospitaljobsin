'use client';

import { Skeleton } from '@heroui/react';

export function BlogPostSkeleton() {
	return (
		<div className='max-w-7xl px-4 mx-auto space-y-6'>
			<Skeleton className='w-full h-[400px] rounded-lg' />
			<div className='flex gap-2'>
				<Skeleton className='w-20 h-6 rounded-full' />
				<Skeleton className='w-20 h-6 rounded-full' />
			</div>
			<Skeleton className='w-3/4 h-12 rounded-lg' />
			<div className='flex gap-4'>
				<Skeleton className='w-32 h-4 rounded-lg' />
				<Skeleton className='w-32 h-4 rounded-lg' />
			</div>
			<div className='space-y-4'>
				<Skeleton className='w-full h-4 rounded-lg' />
				<Skeleton className='w-full h-4 rounded-lg' />
				<Skeleton className='w-full h-4 rounded-lg' />
				<Skeleton className='w-5/6 h-4 rounded-lg' />
			</div>
		</div>
	);
}
