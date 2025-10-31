'use client';

import { Button } from '@heroui/react';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
	forceOpen?: boolean; // New prop to force the sidebar to open
	onCollapseChange?: (isCollapsed: boolean) => void; // Callback to notify parent of collapse state changes
}

export default function MapFilterSidebar({ filters, totalCount, bounds, currentZoom, forceOpen, onCollapseChange }: MapFilterSidebarProps) {
	// State to track if sidebar was explicitly closed by user
	const [wasExplicitlyClosed, setWasExplicitlyClosed] = useState(false);
	// Track if we have jobs in the current viewport
	const [hasJobsInViewport, setHasJobsInViewport] = useState(false);
	// Main collapse state - starts collapsed if no jobs initially
	const [isCollapsed, setIsCollapsed] = useState(true);

	// Track if this is the initial mount
	const isInitialMount = useRef(true);

	// Handle force open prop
	useEffect(() => {
		if (forceOpen) {
			const wasCollapsed = isCollapsed;
			setIsCollapsed(false);
			setWasExplicitlyClosed(false); // Reset explicit close flag when forced open

			// Notify parent if state changed
			if (wasCollapsed) {
				onCollapseChange?.(false);
			}
		}
	}, [forceOpen, isCollapsed, onCollapseChange]);

	// Monitor job availability and auto-open/close logic
	useEffect(() => {
		const shouldShowJobs = bounds && currentZoom >= 5;

		if (isInitialMount.current) {
			// On initial load, collapse if no jobs are available (unless forced open)
			const initialCollapsedState = !forceOpen && (!shouldShowJobs || totalCount === 0);
			setIsCollapsed(initialCollapsedState);
			onCollapseChange?.(initialCollapsedState);
			isInitialMount.current = false;
			return;
		}

		// Don't auto-close if forced open
		if (forceOpen) {
			return;
		}

		if (shouldShowJobs) {
			// Jobs are available in viewport, track this
			setHasJobsInViewport(true);

			// Auto-open sidebar if user hasn't explicitly closed it
			if (!wasExplicitlyClosed && isCollapsed) {
				setIsCollapsed(false);
				onCollapseChange?.(false);
			}
		} else {
			// No jobs in viewport
			setHasJobsInViewport(false);

			// Auto-collapse if no jobs available (unless user explicitly opened it)
			if (!wasExplicitlyClosed && !isCollapsed) {
				setIsCollapsed(true);
				onCollapseChange?.(true);
			}
		}
	}, [bounds, currentZoom, totalCount, wasExplicitlyClosed, forceOpen, isCollapsed, onCollapseChange]);

	const toggleCollapse = () => {
		const newCollapsedState = !isCollapsed;
		setIsCollapsed(newCollapsedState);

		// Mark as explicitly closed/opened by user
		setWasExplicitlyClosed(newCollapsedState);

		// If user explicitly opens sidebar when no jobs, reset the explicit flag
		// so it can auto-close again when jobs disappear
		if (!newCollapsedState && !hasJobsInViewport) {
			setWasExplicitlyClosed(false);
		}

		// Notify parent component of collapse state change
		onCollapseChange?.(newCollapsedState);
	};

	return (
		<div className='relative h-full flex overflow-visible'>
			{/* Main Sidebar Content */}
			<div
				className={`h-full flex flex-col gap-6 p-4 bg-background transition-all duration-300 ease-in-out border-r border-divider ${
					isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-md opacity-100'
				}`}
			>
				{/* Header with Job Count */}
				<div className='mb-4 w-full flex flex-col gap-2'>
					<h2 className='text-base font-medium text-foreground-800'>{totalCount.toLocaleString()} Jobs in Current Area</h2>

					<p className='text-xs text-foreground-500'>Showing jobs in the current map view</p>
				</div>

				{/* Viewport Jobs List - always shown */}
				<div className='w-full flex-1 flex flex-col min-h-0'>
					<div className='w-full flex-1 min-h-0 overflow-y-auto'>
						{!isCollapsed && bounds && currentZoom >= 5 ? (
							<ViewportJobsList
								key={`${bounds.swLat}-${bounds.swLng}-${bounds.neLat}-${bounds.neLng}`}
								bounds={bounds}
								filters={filters}
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
										{isCollapsed ? 'Expand sidebar to see jobs' : currentZoom < 5 ? 'Zoom in to see jobs' : 'Move the map to see jobs'}
									</p>
									<p className='text-sm text-foreground-500 max-w-xs mx-auto'>Try zooming into an area to find jobs</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Floating Chevron Toggle Button */}
			<div
				className={`absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ease-in-out ${
					isCollapsed ? 'left-1' : 'left-full -translate-x-4'
				}`}
			>
				<Button
					isIconOnly
					size='sm'
					variant='solid'
					onPress={toggleCollapse}
					className='h-10 w-10 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-200 border-2 border-white'
					aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					<ChevronLeft size={18} className={`transition-transform duration-300 ease-in-out ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
				</Button>
			</div>
		</div>
	);
}
