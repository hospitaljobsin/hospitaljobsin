import { Skeleton } from '@heroui/react';

export default function OrganizationsGridSkeleton() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{Array.from({ length: 12 }).map((_, i) => (
				<Skeleton key={i} className='h-32 w-full rounded-lg' />
			))}
		</div>
	);
}
