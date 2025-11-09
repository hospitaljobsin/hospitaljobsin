'use client';

import { Skeleton } from '@heroui/react';

export function BlogPostsSkeleton() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{Array.from({ length: 6 }, (_, i) => i).map(index => (
				<div key={`skeleton-${index}`} className='space-y-3'>
					<Skeleton className='w-full h-48 rounded-lg' />
					<Skeleton className='w-3/4 h-6 rounded-lg' />
					<Skeleton className='w-full h-4 rounded-lg' />
					<Skeleton className='w-full h-4 rounded-lg' />
					<div className='flex gap-2'>
						<Skeleton className='w-20 h-4 rounded-lg' />
						<Skeleton className='w-20 h-4 rounded-lg' />
					</div>
				</div>
			))}
		</div>
	);
}
