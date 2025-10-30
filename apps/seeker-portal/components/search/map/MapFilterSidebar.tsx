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

export default function MapFilterSidebar({ filters, totalCount, bounds, onJobSelect }: MapFilterSidebarProps) {
	return (
		<div className='p-4 space-y-4'>
			{/* Header with Job Count */}
			<div className='mb-4'>
				<h2 className='text-base font-medium text-foreground-800'>{totalCount.toLocaleString()} Jobs</h2>
			</div>

			{/* Viewport Jobs List - shown when bounds are available */}
			{bounds && (
				<div>
					<div className='mb-3'>
						<h3 className='text-sm font-medium text-foreground-700 mb-1'>Jobs in Current Area</h3>
						<p className='text-xs text-foreground-500'>Showing jobs in the current map view</p>
					</div>
					<ViewportJobsList
						key={`${bounds.swLat}-${bounds.swLng}-${bounds.neLat}-${bounds.neLng}`}
						bounds={bounds}
						filters={filters}
						onJobSelect={onJobSelect}
						className='max-h-96 overflow-y-auto'
					/>
				</div>
			)}
		</div>
	);
}
