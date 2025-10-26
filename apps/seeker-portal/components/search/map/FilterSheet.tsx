'use client';

import { Badge } from '@heroui/react';
import { Filter } from 'lucide-react';
import { useRef, useState } from 'react';
import { Sheet, type SheetRef } from 'react-modal-sheet';
import type { SearchLocation } from '@/components/forms/LocationAutocomplete';
import MapFilterSidebar from './MapFilterSidebar';

interface FilterBottomSheetProps {
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
	onFiltersChange?: (filters: Partial<FilterBottomSheetProps['filters']>) => void;
	onLocationSelect?: (location: SearchLocation) => void;
	totalCount: number;
	isPending?: boolean;
	activeFilterCount: number;
}

export default function FilterSheet({
	filters,
	onFiltersChange,
	onLocationSelect,
	totalCount,
	isPending = false,
	activeFilterCount
}: FilterBottomSheetProps) {
	const ref = useRef<SheetRef>(null);
	const [currentSnap, setCurrentSnap] = useState(1);

	// Snap points:
	// 0 = fully closed (required by react-modal-sheet)
	// 1 = tucked in (showing just the header peek - 120px from bottom)
	// 2 = half open (50% of viewport)
	// 3 = fully open (100% of viewport)
	const snapPoints = [0, 120, 0.5, 1];

	const handleSnapTo = (index: number) => {
		ref.current?.snapTo(index);
	};

	return (
		<Sheet
			ref={ref}
			isOpen={true}
			onClose={() => {}}
			initialSnap={1}
			snapPoints={snapPoints}
			onSnap={snapIndex => setCurrentSnap(snapIndex)}
			disableScrollLocking={true}
		>
			<Sheet.Container
				className='!bg-background !rounded-t-3xl !shadow-2xl'
				style={{
					boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.15)'
				}}
			>
				<Sheet.Header
					className='!bg-background !rounded-t-3xl !border-b !border-divider'
					style={{
						padding: '16px',
						cursor: 'grab',
						userSelect: 'none'
					}}
				>
					<div className='flex flex-col items-center gap-2'>
						<div className='w-12 h-1 bg-default-300 rounded-full' />
						<div className='w-full flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<Filter className='w-5 h-5 text-primary' />
								<h3 className='text-lg font-semibold'>Filters</h3>
								{activeFilterCount > 0 && (
									<Badge color='danger' size='sm'>
										{activeFilterCount}
									</Badge>
								)}
							</div>
							<p className='text-sm text-default-500'>
								{totalCount} job{totalCount !== 1 ? 's' : ''}
							</p>
						</div>
					</div>
				</Sheet.Header>

				<Sheet.Content
					className='!bg-background'
					style={{
						paddingBottom: 'env(safe-area-inset-bottom)'
					}}
				>
					<div className='px-6 pb-6 overflow-y-auto' style={{ maxHeight: 'calc(90vh - 100px)' }}>
						<MapFilterSidebar
							filters={filters}
							onFiltersChange={onFiltersChange}
							onLocationSelect={onLocationSelect}
							totalCount={totalCount}
							isPending={isPending}
						/>
					</div>
				</Sheet.Content>
			</Sheet.Container>

			{/* Only show backdrop when sheet is expanded beyond tucked position */}
			{currentSnap > 1 && <Sheet.Backdrop onTap={() => handleSnapTo(1)} className='!bg-black/40' />}
		</Sheet>
	);
}
