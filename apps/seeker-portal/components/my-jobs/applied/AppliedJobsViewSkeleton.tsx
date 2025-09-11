'use client';
import JobListSkeleton from '@/components/landing/JobListSkeleton';
import MyJobsHeaderSkeleton from '@/components/layout/MyJobsHeaderSkeleton';

export default function AppliedJobsViewSkeleton() {
	return (
		<div className='w-full h-full flex flex-col'>
			<MyJobsHeaderSkeleton />
			<div className='w-full mx-auto bg-background-600 h-full'>
				<div className='w-full px-5 max-w-7xl mx-auto h-full'>
					<div className='w-full flex flex-col h-full py-8'>
						<JobListSkeleton count={2} />
					</div>
				</div>
			</div>
		</div>
	);
}
