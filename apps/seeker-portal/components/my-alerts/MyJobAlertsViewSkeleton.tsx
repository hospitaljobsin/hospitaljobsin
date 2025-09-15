import DashboardHeaderSkeleton from '../layout/DashboardHeaderSkeleton';

export default function MyJobAlertsViewSkeleton() {
	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeaderSkeleton />
			<div className='w-full mx-auto bg-background-600'>
				<div className='w-full px-5 max-w-7xl mx-auto'>My Job Alerts View</div>
			</div>
		</div>
	);
}
