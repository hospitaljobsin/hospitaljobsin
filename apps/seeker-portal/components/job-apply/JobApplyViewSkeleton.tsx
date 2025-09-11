import { Skeleton } from '@heroui/react';
import DashboardHeaderSkeleton from '../layout/DashboardHeaderSkeleton';

export default function JobApplyViewSkeleton() {
	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeaderSkeleton />
			<div className='w-full mx-auto bg-background-600'>
				<div className='w-full px-5 max-w-7xl mx-auto'>
					<div className='py-8 w-full h-full flex flex-col items-center gap-6'>
						<Skeleton className='w-full h-32 lg:h-96 rounded-md' />
						<Skeleton className='w-full h-24 lg:h-64 rounded-md' />
					</div>
				</div>
			</div>
		</div>
	);
}
