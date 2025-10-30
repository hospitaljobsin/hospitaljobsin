'use client';

import { Skeleton } from '@heroui/react';

interface ClusterJobsListSkeletonProps {
	count?: number;
}

export default function ClusterJobsListSkeleton({ count = 12 }: ClusterJobsListSkeletonProps) {
	return (
		<div className='w-full space-y-2 overflow-y-hidden'>
			{Array.from({ length: count }, (_, i) => `skeleton-${Date.now()}-${i}`).map(key => (
				<Skeleton key={key} className='w-full min-w-96 h-24 rounded-lg' />
			))}
		</div>
	);
}
