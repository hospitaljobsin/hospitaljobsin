import { Select, SelectItem, Skeleton } from '@heroui/react';

import JobListSkeleton from '../landing/JobListSkeleton';

export default function SearchJobsListSkeleton() {
	return (
		<div
			className='h-full w-full scroll-smooth overflow-y-auto lg:min-h-0'
			style={{
				scrollbarWidth: 'none'
			}}
		>
			<div className='w-full flex gap-12 justify-between items-center mb-6 sm:mb-8'>
				<Skeleton className='rounded-md h-6 w-48' />
				<div className='flex gap-2 w-full sm:max-w-xs'>
					<Select label='Sort by' placeholder='Select sorting option' isDisabled variant='faded' size='sm'>
						<SelectItem key='RELEVANCE'>Relevance</SelectItem>
						<SelectItem key='UPDATED_AT'>Date Posted</SelectItem>
					</Select>
				</div>
			</div>
			<div className='w-full flex flex-col'>
				{Array.from({ length: 10 }, (_, index) => `skeleton-job-${index}`).map(key => (
					<div key={key} className='pb-4 sm:pb-6'>
						<JobListSkeleton />
					</div>
				))}
			</div>
		</div>
	);
}
