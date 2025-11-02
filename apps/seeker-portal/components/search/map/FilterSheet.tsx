'use client';

import { Select, SelectItem } from '@heroui/react';
import { FileIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Sheet, type SheetRef } from 'react-modal-sheet';
import ViewportJobsList from './ClusterJobsList';

type ClusterInfo = {
	hexId: string;
	count: number;
	center: [number, number];
};

interface ClusterSheetProps {
	totalCount: number;
	isPending?: boolean;
	// Cluster support props
	selectedCluster?: ClusterInfo | null;
	// Viewport jobs props
	bounds?: {
		swLat: number;
		swLng: number;
		neLat: number;
		neLng: number;
	} | null;
	currentZoom: number;
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
	forceOpen?: boolean; // New prop to force the sheet to open when cluster cannot expand
}

export default function FilterSheet({ totalCount, selectedCluster, bounds, filters, currentZoom, forceOpen }: ClusterSheetProps) {
	const ref = useRef<SheetRef>(null);
	const [currentSnap, setCurrentSnap] = useState(1);
	const [sortBy, setSortBy] = useState<string>(filters.sortBy || 'RELEVANCE');
	// Track the actual total count from the jobs list query
	const [actualTotalCount, setActualTotalCount] = useState<number>(totalCount);
	// Track if user has manually tucked the sheet
	const [isManuallyTucked, setIsManuallyTucked] = useState(false);
	// Track programmatic snaps to avoid treating them as manual
	const isProgrammaticSnapRef = useRef(false);
	// Track if this is the initial mount to avoid treating initial snap as manual
	const isInitialMountRef = useRef(true);

	// Debug: Log all props on every render
	console.log('🔍 FilterSheet render:', {
		selectedCluster,
		currentZoom,
		isManuallyTucked,
		currentSnap,
		totalCount
	});

	// Enhanced snap points based on PRD specifications:
	// 0 = Hidden (fully closed) - 0
	// 1 = Tucked (handle + peek) - 120px
	// 2 = No cluster state (35% of viewport) - 0.35
	// 3 = Cluster selected (60% of viewport) - 0.6
	// 4 = Full screen (100% of viewport) - 1
	const snapPoints = [0, 120, 0.35, 0.6, 1];

	// Handle force open prop
	useEffect(() => {
		// Respect user's manual tuck choice - don't force open if manually tucked
		if (isManuallyTucked) {
			console.log('⏸️ Force open blocked: user manually tucked');
			return;
		}

		if (forceOpen) {
			console.log('🔓 Force opening sheet to 35%');
			// Force open to default jobs view (index 2 - 35% viewport)
			isProgrammaticSnapRef.current = true;
			ref.current?.snapTo(2);
		}
	}, [forceOpen, isManuallyTucked]);

	// Sync sortBy state with filters prop
	useEffect(() => {
		setSortBy(filters.sortBy || 'RELEVANCE');
	}, [filters.sortBy]);

	// Auto-snap based on cluster state
	useEffect(() => {
		// If user has manually tucked the sheet, respect their choice - never auto-open
		if (isManuallyTucked) {
			console.log('⏸️ Auto-snap blocked: user manually tucked (will stay tucked)');
			return;
		}

		// Only auto-open if we have a selected cluster at the right zoom level
		if (selectedCluster && currentZoom >= 10) {
			console.log('� Auto-opening sheet to 60% for cluster:', selectedCluster);
			// Snap to cluster state (index 3 - 60% viewport) when cluster is selected at zoom 10+
			isProgrammaticSnapRef.current = true;
			ref.current?.snapTo(3);
		}
		// Don't auto-tuck when cluster is deselected - let user control the position
	}, [selectedCluster, currentZoom, isManuallyTucked]);

	const handleSnapTo = (index: number) => {
		ref.current?.snapTo(index);
	};

	// Track user's manual snap changes
	const handleSnapChange = (snapIndex: number) => {
		setCurrentSnap(snapIndex);

		// Ignore initial mount snap - the sheet starts at position 1 by default
		if (isInitialMountRef.current) {
			console.log('🆕 Initial mount snap detected, ignoring');
			isInitialMountRef.current = false;
			return;
		}

		// Check if this is a programmatic snap (auto-triggered)
		if (isProgrammaticSnapRef.current) {
			console.log('🤖 Programmatic snap detected, ignoring for manual tuck tracking');
			isProgrammaticSnapRef.current = false;
			return;
		}

		console.log('👆 User manual snap to index:', snapIndex);

		// If user manually snaps to tucked position (index 1 or 0), mark as manually tucked
		if (snapIndex <= 1) {
			console.log('📥 User manually tucked sheet');
			setIsManuallyTucked(true);
		} else {
			// If user opens the sheet to any other position, clear the manual tuck flag
			console.log('📤 User manually opened sheet, clearing tuck flag');
			setIsManuallyTucked(false);
		}
	};

	// Create updated filters with current sortBy
	const updatedFilters = { ...filters, sortBy };

	// Render different content based on current state
	const renderContent = () => {
		// Tucked state - minimal handle
		if (currentSnap <= 1) {
			return (
				<div className='px-4 text-center'>
					<p className='text-xs text-default-500 mt-2'>Pull up to see jobs in area</p>
				</div>
			);
		}

		// No cluster state - show viewport jobs or empty state
		if (!selectedCluster && currentSnap === 2) {
			// Check if we have jobs data available and sufficient zoom level
			if (!bounds || currentZoom < 5 || actualTotalCount === 0) {
				return (
					<div className='p-6 text-center'>
						<div className='space-y-3 flex flex-col items-center justify-center'>
							<FileIcon className='text-foreground-400' />
							<h3 className='text-lg font-medium text-foreground-700'>{currentZoom < 5 ? 'Zoom In to See Jobs' : 'No Jobs Found'}</h3>
							<p className='text-sm text-foreground-500 max-w-xs mx-auto'>Try zooming into an area to find jobs</p>
						</div>
					</div>
				);
			}

			// Show viewport jobs list
			return (
				<div className='flex flex-col h-full'>
					{/* Header */}
					<div className='p-4 border-b dividerborder- bg-background sticky top-0 z-10'>
						<div className='flex items-center justify-between gap-4'>
							<div className='flex-1'>
								<h3 className='text-md font-medium text-foreground-700'>Viewing {actualTotalCount} Jobs</h3>
								<p className='text-xs text-foreground-500'>In Current Area</p>
							</div>
							<Select
								size='sm'
								label='Sort by'
								labelPlacement='outside-left'
								selectedKeys={[sortBy]}
								onChange={e => setSortBy(e.target.value)}
								className='max-w-[200px]'
								classNames={{
									label: 'text-xs text-foreground-600 whitespace-nowrap',
									base: 'items-center'
								}}
							>
								<SelectItem key='RELEVANCE'>Relevance</SelectItem>
								<SelectItem key='CREATED_AT'>Newest First</SelectItem>
							</Select>
						</div>
					</div>

					{/* Jobs List Content */}
					<div className='flex-1 overflow-y-auto p-4 w-full'>
						{currentZoom >= 5 ? (
							<ViewportJobsList
								key={`${bounds.swLat}-${bounds.swLng}-${bounds.neLat}-${bounds.neLng}-${updatedFilters.searchTerm || ''}-${updatedFilters.location || ''}-${updatedFilters.minExperience || ''}-${updatedFilters.minSalary || ''}-${updatedFilters.maxSalary || ''}-${updatedFilters.proximityKm}-${updatedFilters.workMode.join(',')}-${updatedFilters.jobType.join(',')}-${sortBy}`}
								bounds={bounds}
								filters={updatedFilters}
								className='w-full'
								onTotalCountChange={setActualTotalCount}
							/>
						) : (
							<div className='text-center py-8'>
								<FileIcon className='text-foreground-400 mx-auto mb-4' size={48} />
								<h3 className='text-lg font-medium text-foreground-700 mb-2'>Zoom In to See Jobs</h3>
								<p className='text-sm text-foreground-500 max-w-xs mx-auto'>Try zooming into an area to find jobs</p>
							</div>
						)}
					</div>
				</div>
			);
		}

		// Cluster selected or full screen state
		return (
			<div className='flex flex-col h-full'>
				{/* Header */}
				<div className='p-4 border-b border-divider bg-background sticky top-0 z-10'>
					<div className='flex items-center justify-between gap-4'>
						<div className='flex-1'>
							<h3 className='text-md font-medium text-foreground-700'>Viewing {actualTotalCount} Jobs</h3>
							<p className='text-xs text-foreground-500'>In Current Area</p>
						</div>
						<Select
							size='sm'
							label='Sort by'
							labelPlacement='inside'
							selectedKeys={[sortBy]}
							onChange={e => setSortBy(e.target.value)}
							className='max-w-[200px]'
							classNames={{
								label: 'text-xs text-foreground-600 whitespace-nowrap',
								base: 'items-center'
							}}
						>
							<SelectItem key='RELEVANCE'>Relevance</SelectItem>
							<SelectItem key='CREATED_AT'>Newest First</SelectItem>
						</Select>
					</div>
				</div>

				{/* Content */}
				<div className='flex-1 overflow-y-auto p-4'>
					{selectedCluster ? (
						<div className='space-y-4'>
							{/* Show jobs list if we have bounds data and sufficient zoom */}
							{bounds && currentZoom >= 5 ? (
								<ViewportJobsList
									key={`${bounds.swLat}-${bounds.swLng}-${bounds.neLat}-${bounds.neLng}-${updatedFilters.searchTerm || ''}-${updatedFilters.location || ''}-${updatedFilters.minExperience || ''}-${updatedFilters.minSalary || ''}-${updatedFilters.maxSalary || ''}-${updatedFilters.proximityKm}-${updatedFilters.workMode.join(',')}-${updatedFilters.jobType.join(',')}-${sortBy}`}
									bounds={bounds}
									filters={updatedFilters}
									className='w-full'
									onTotalCountChange={setActualTotalCount}
								/>
							) : bounds && currentZoom < 5 ? (
								<div className='text-center py-8'>
									<FileIcon className='text-foreground-400 mx-auto mb-4' size={48} />
									<h3 className='text-lg font-medium text-foreground-700 mb-2'>Zoom In to See Jobs</h3>
									<p className='text-sm text-foreground-500 max-w-xs mx-auto'>Try zooming into an area to find jobs</p>
								</div>
							) : null}
						</div>
					) : bounds && totalCount > 0 && currentZoom >= 5 ? (
						// Show viewport jobs if no cluster is selected but we have jobs and sufficient zoom
						<ViewportJobsList
							key={`${bounds.swLat}-${bounds.swLng}-${bounds.neLat}-${bounds.neLng}-${updatedFilters.searchTerm || ''}-${updatedFilters.location || ''}-${updatedFilters.minExperience || ''}-${updatedFilters.minSalary || ''}-${updatedFilters.maxSalary || ''}-${updatedFilters.proximityKm}-${updatedFilters.workMode.join(',')}-${updatedFilters.jobType.join(',')}-${sortBy}`}
							bounds={bounds}
							filters={updatedFilters}
							className='w-full'
							onTotalCountChange={setActualTotalCount}
						/>
					) : (
						// Show empty state if no jobs or insufficient zoom
						<div className='text-center py-8'>
							<FileIcon className='text-foreground-400 mx-auto mb-4' size={48} />
							<h3 className='text-xl font-semibold text-foreground-700 mb-2'>
								{currentZoom < 5 ? 'Zoom In to See Jobs' : 'No Jobs Found'}
							</h3>
							<p className='text-sm text-foreground-500 max-w-xs mx-auto'>Try zooming into an area to find jobs</p>
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<Sheet
			ref={ref}
			isOpen={true}
			onClose={() => {}}
			initialSnap={1}
			snapPoints={snapPoints}
			onSnap={handleSnapChange}
			disableScrollLocking={true}
			disableDrag={false}
			disableDismiss={true}
		>
			<Sheet.Container className='!bg-background !rounded-t-3xl !shadow-2xl' style={{ zIndex: 50 }}>
				<Sheet.Header />
				<Sheet.Content className='!bg-background h-full'>{renderContent()}</Sheet.Content>
			</Sheet.Container>

			{/* Conditional Backdrop - only for full screen */}
			{currentSnap >= 4 && (
				<Sheet.Backdrop onTap={() => handleSnapTo(selectedCluster ? 3 : 2)} className='!bg-black/40' style={{ zIndex: 40 }} />
			)}
		</Sheet>
	);
}
