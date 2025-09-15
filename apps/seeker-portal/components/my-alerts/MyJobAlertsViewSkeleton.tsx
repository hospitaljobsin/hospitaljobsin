import { Skeleton } from '@heroui/react';
import DashboardHeaderSkeleton from '../layout/DashboardHeaderSkeleton';
import JobAlertsListSkeleton from './JobAlertsListSkeleton';

export default function MyJobAlertsViewSkeleton() {
	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeaderSkeleton />
			<div className='w-full mx-auto bg-background-600'>
				<div className='w-full px-5 max-w-7xl mx-auto py-6'>
					<div className='flex flex-col w-full h-full gap-12'>
						<div className='flex flex-row justify-between items-center'>
							<div className='space-y-2'>
								<h2 className='text-2xl font-medium'>My Job Alerts</h2>
								<p className='text-sm text-foreground-600'>Get notified when new jobs match your preferences</p>
							</div>
							<Skeleton className='h-12 w-48 rounded-md' />
						</div>
						<div className='w-full flex flex-col gap-8 pb-6'>
							<JobAlertsListSkeleton />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
