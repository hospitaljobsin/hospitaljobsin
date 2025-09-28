'use client';
import DashboardHeaderSkeleton from '../layout/DashboardHeaderSkeleton';
import { ResumePreview } from './ResumePreview';
import { Sidebar } from './Sidebar';

export default function ResumeBuilderViewSkeleton() {
	return (
		<div className='w-ful bg-background-600 flex flex-col flex-1 h-full'>
			<DashboardHeaderSkeleton />
			<div className='w-full max-w-7xl mx-auto bg-background-600 flex flex-col flex-1 h-full'>
				<main className='flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 py-4 lg:py-8 px-4'>
					<div className='lg:col-span-3 order-1 sticky'>
						<Sidebar />
					</div>
					<div className='lg:col-span-6 flex flex-col gap-10 order-2'>
						<div className='w-full flex flex-col flex-1 h-full'>{/* Content Skeleton */}</div>
					</div>
					<div className='lg:col-span-3 order-3'>
						<ResumePreview />
					</div>
				</main>
			</div>
		</div>
	);
}
