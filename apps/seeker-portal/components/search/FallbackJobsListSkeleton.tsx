import JobListSkeleton from '../landing/JobListSkeleton';

export default function FallbackJobsListSkeleton() {
	return (
		<div className='w-full h-full flex flex-col gap-6'>
			<p className='text-foreground-400 text-sm'>Meanwhile, here are the latest jobs you might like.</p>

			<JobListSkeleton />
		</div>
	);
}
