import { Skeleton } from '@heroui/react';
import JobSkeleton from './JobSkeleton';

export default function JobListSkeleton({ count = 8 }: { count?: number }) {
	return (
		<>
			<div className='hidden md:flex w-full'>
				<Skeleton className='rounded-lg h-80 w-full' />
			</div>
			<div className='md:hidden w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6'>
				{Array.from({ length: count }).map((_, index) => (
					<JobSkeleton key={`job-skeleton${index}`} />
				))}
			</div>
		</>
	);
}
