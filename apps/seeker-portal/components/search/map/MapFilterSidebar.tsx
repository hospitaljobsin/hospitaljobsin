'use client';

import ViewportJobsList from './ClusterJobsList';

interface MapFilterSidebarProps {
	filters: {
		searchTerm: string | null;
		location: string | null;
		minExperience: number | null;
		minSalary: number | null;
		maxSalary: number | null;
		proximityKm: number;
		workMode: readonly string[];
		jobType: readonly string[];
		sortBy: string;
	};
	totalCount: number;
	isPending?: boolean;
	// Viewport bounds for ViewportJobsList
	bounds?: {
		swLat: number;
		swLng: number;
		neLat: number;
		neLng: number;
	} | null;
	currentZoom: number;
	onJobSelect?: (jobId: string) => void;
}

export default function MapFilterSidebar({ filters, totalCount, bounds, onJobSelect, currentZoom }: MapFilterSidebarProps) {
	return (
		<div className='w-full h-full flex flex-col p-4'>
			{/* Header with Job Count */}
			<div className='mb-4 w-full'>
				<h2 className='text-base font-medium text-foreground-800'>{totalCount.toLocaleString()} Jobs</h2>
			</div>

			{/* Viewport Jobs List - always shown */}
			<div className='w-full flex-1 flex flex-col min-h-0'>
				<div className='mb-3 w-full flex-shrink-0'>
					<h3 className='text-sm font-medium text-foreground-700 mb-1'>Jobs in Current Area</h3>
					<p className='text-xs text-foreground-500'>Showing jobs in the current map view</p>
				</div>
				<div className='w-full flex-1 min-h-0 overflow-y-auto'>
					{bounds && currentZoom >= 5 ? (
						<ViewportJobsList
							key={`${bounds.swLat}-${bounds.swLng}-${bounds.neLat}-${bounds.neLng}`}
							bounds={bounds}
							filters={filters}
							onJobSelect={onJobSelect}
							className='w-full'
						/>
					) : (
						<div className='w-full h-full flex items-center justify-center text-center py-8'>
							<div className='space-y-2'>
								<div className='w-12 h-12 mx-auto rounded-full bg-foreground-100 flex items-center justify-center mb-3'>
									<svg className='w-6 h-6 text-foreground-400' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={1.5}
											d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
										/>
									</svg>
								</div>
								<p className='text-sm font-medium text-foreground-600'>
									{currentZoom < 5 ? 'Zoom in to see jobs' : 'Move the map to see jobs'}
								</p>
								<p className='text-xs text-foreground-500'>
									{currentZoom < 5 ? 'Zoom to level 5 or higher to load job listings' : 'Pan or zoom the map to view available positions'}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
