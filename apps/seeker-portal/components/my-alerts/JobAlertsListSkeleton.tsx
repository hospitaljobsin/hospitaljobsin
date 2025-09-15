import JobAlertSkeleton from './JobAlertSkeleton';

export default function JobAlertsListSkeleton() {
	return (
		<div className='w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6'>
			{Array.from({ length: 3 }).map((_, index) => (
				<JobAlertSkeleton key={`job-alert-skeleton${index}`} />
			))}
		</div>
	);
}
