'use client';

import { Skeleton } from '@heroui/react';

interface ClusterJobsListSkeletonProps {
	count?: number;
}

export default function ClusterJobsListSkeleton({ count = 12 }: ClusterJobsListSkeletonProps) {
	const skeletonItems = Array.from({ length: count }, (_, i) => `skeleton-item-${i}`);

	return (
		<div className='w-full space-y-6 overflow-y-hidden'>
			{skeletonItems.map(skeletonId => (
				<Skeleton key={skeletonId} className='w-full min-w-96 h-64 rounded-lg' />
			))}
		</div>
	);
}
