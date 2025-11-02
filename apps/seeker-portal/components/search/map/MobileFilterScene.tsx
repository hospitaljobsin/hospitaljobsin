'use client';

import { Button, Checkbox, CheckboxGroup, Slider } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import JobSearchAutocomplete from '@/components/forms/JobSearchAutocomplete';
import type { SearchLocation } from '@/components/forms/LocationAutocomplete';
import LocationAutocomplete from '@/components/forms/LocationAutocomplete';

interface MobileFilterSceneProps {
	isOpen: boolean;
	onClose: () => void;
	searchTerm: string | null;
	location: string | null;
	onSearchTermChange?: (term: string | null) => void;
	onLocationChange?: (location: string | null) => void;
	onLocationSelect?: (location: SearchLocation) => void;
	// Filter props
	filters: {
		jobType: readonly string[];
		workMode: readonly string[];
		minExperience: number | null;
		minSalary: number | null;
		maxSalary: number | null;
	};
	onFiltersChange?: (filters: Partial<MobileFilterSceneProps['filters']>) => void;
	resultCount?: number;
	initialFocus?: 'search' | 'location';
}

// Scene slide animation - bottom to top
const sceneVariants = {
	initial: { y: '100%', opacity: 0 },
	animate: { y: 0, opacity: 1 },
	exit: { y: '100%', opacity: 0 }
};

const sceneTransition = {
	type: 'spring' as const,
	damping: 30,
	stiffness: 300
};

/**
 * Mobile Filter Scene
 *
 * A full-screen mobile overlay that appears when users tap on search inputs.
 * Provides focused input experience with contextual filters below.
 */
export default function MobileFilterScene({
	isOpen,
	onClose,
	searchTerm,
	location,
	onSearchTermChange,
	onLocationChange,
	onLocationSelect: _onLocationSelect,
	filters,
	onFiltersChange,
	resultCount = 0,
	initialFocus = 'search'
}: MobileFilterSceneProps) {
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
	const [localLocation, setLocalLocation] = useState(location || '');
	const [activeInput, setActiveInput] = useState<'search' | 'location'>(initialFocus);
	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

	// Local filter state - allows changes without triggering URL updates until Apply is clicked
	const [localFilters, setLocalFilters] = useState(filters);

	// Sync local filters with prop filters when modal opens or filters change externally
	useEffect(() => {
		if (isOpen) {
			setLocalFilters(filters);
		}
	}, [isOpen, filters]);

	// Create or get the portal container with maximum z-index
	useLayoutEffect(() => {
		if (typeof document === 'undefined') return;

		let container = document.getElementById('mobile-filter-portal-root');
		if (!container) {
			container = document.createElement('div');
			container.id = 'mobile-filter-portal-root';
			container.style.position = 'fixed';
			container.style.top = '0';
			container.style.left = '0';
			container.style.width = '100%';
			container.style.height = '100%';
			container.style.pointerEvents = 'none'; // Allow clicks to pass through when empty
			container.style.zIndex = '2147483647'; // Maximum z-index
			container.style.isolation = 'isolate'; // Create new stacking context
			document.body.appendChild(container);
		}
		setPortalContainer(container);

		return () => {
			// Don't remove the container on unmount as other instances might be using it
			setPortalContainer(null);
		};
	}, []);

	// Manage portal container pointer events based on modal state
	useEffect(() => {
		if (!portalContainer) return;

		if (isOpen) {
			portalContainer.style.pointerEvents = 'auto';
		} else {
			portalContainer.style.pointerEvents = 'none';
		}

		return () => {
			if (portalContainer) {
				portalContainer.style.pointerEvents = 'none';
			}
		};
	}, [isOpen, portalContainer]);

	// Sync with props
	useEffect(() => {
		setLocalSearchTerm(searchTerm || '');
	}, [searchTerm]);

	useEffect(() => {
		setLocalLocation(location || '');
	}, [location]);

	// Set initial active input when scene opens
	useEffect(() => {
		if (isOpen) {
			setActiveInput(initialFocus);
		}
	}, [isOpen, initialFocus]);

	const handleSearchClear = useCallback(() => {
		setLocalSearchTerm('');
		onSearchTermChange?.(null);
	}, [onSearchTermChange]);

	const handleLocationClear = useCallback(() => {
		setLocalLocation('');
		onLocationChange?.(null);
	}, [onLocationChange]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		},
		[onClose]
	);

	const handleApply = useCallback(() => {
		// Trigger final updates if needed
		onSearchTermChange?.(localSearchTerm.trim() || null);
		onLocationChange?.(localLocation.trim() || null);
		// Apply all filter changes at once - ensure arrays are properly passed
		onFiltersChange?.({
			jobType: localFilters.jobType,
			workMode: localFilters.workMode,
			minExperience: localFilters.minExperience,
			minSalary: localFilters.minSalary,
			maxSalary: localFilters.maxSalary
		});
		onClose();
	}, [localSearchTerm, localLocation, localFilters, onSearchTermChange, onLocationChange, onFiltersChange, onClose]);

	// Local filter update handler
	const handleLocalFilterChange = useCallback((updates: Partial<typeof localFilters>) => {
		setLocalFilters(prev => ({ ...prev, ...updates }));
	}, []);

	// Use portal to render outside the normal DOM hierarchy to avoid z-index conflicts
	// Return null on server side (SSR) or if portal container isn't ready
	if (typeof document === 'undefined' || !portalContainer) {
		return null;
	}

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<motion.div
					variants={sceneVariants}
					initial='initial'
					animate='animate'
					exit='exit'
					transition={sceneTransition}
					className='fixed inset-0 bg-background'
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						pointerEvents: 'auto', // Enable interactions
						zIndex: 'inherit' // Inherit from portal container
					}}
					onKeyDown={handleKeyDown}
				>
					{/* Header */}
					<div className='sticky top-0 z-10 bg-background border-b border-divider p-4'>
						<div className='flex items-center gap-3'>
							<Button isIconOnly size='sm' variant='light' onPress={onClose} aria-label='Go back'>
								<ArrowLeft size={20} />
							</Button>
							<h1 className='text-lg font-semibold'>Search & Filter</h1>
						</div>
					</div>

					{/* Search Inputs */}
					<div className='p-4 space-y-3'>
						{/* Search Input */}
						<div className={`transition-all duration-200 ${activeInput === 'search' ? 'ring-2 ring-primary rounded-xl' : ''}`}>
							<JobSearchAutocomplete
								value={localSearchTerm}
								onValueChange={setLocalSearchTerm}
								onSubmit={term => onSearchTermChange?.(term)}
								onClear={handleSearchClear}
								onFocus={() => setActiveInput('search')}
								placeholder='Search jobs, skills, companies...'
								variant='flat'
								size='lg'
								aria-label='Search for job titles, companies, or skills'
								classNames={{
									base: 'w-full'
								}}
								popoverProps={{
									classNames: {
										content: 'z-[2147483648]' // Higher than modal container
									},
									placement: 'bottom',
									shouldBlockScroll: false
								}}
							/>
						</div>

						{/* Location Input */}
						<div className={`transition-all duration-200 ${activeInput === 'location' ? 'ring-2 ring-primary rounded-xl' : ''}`}>
							<LocationAutocomplete
								value={localLocation}
								onValueChange={setLocalLocation}
								onLocationSelect={_onLocationSelect}
								onSubmit={location => onLocationChange?.(location)}
								onClear={handleLocationClear}
								onFocus={() => setActiveInput('location')}
								placeholder='City, state, or zip code...'
								variant='flat'
								size='lg'
								aria-label='Search by city, state, or area'
								classNames={{
									base: 'w-full'
								}}
								popoverProps={{
									classNames: {
										content: 'z-[2147483648]' // Higher than modal container
									},
									placement: 'bottom',
									shouldBlockScroll: false
								}}
							/>
						</div>
					</div>

					{/* Filters Content */}
					<div className='flex-1 overflow-y-auto px-4 pb-20'>
						<div className='space-y-6'>
							<CheckboxGroup
								label='Job Type'
								value={localFilters.jobType as string[]}
								onValueChange={value => handleLocalFilterChange({ jobType: value as readonly string[] })}
								className='w-full'
								classNames={{
									wrapper: 'flex-row flex-wrap gap-2'
								}}
							>
								<Checkbox value='FULL_TIME'>Full Time</Checkbox>
								<Checkbox value='PART_TIME'>Part Time</Checkbox>
								<Checkbox value='INTERNSHIP'>Internship</Checkbox>
								<Checkbox value='CONTRACT'>Contract</Checkbox>
								<Checkbox value='LOCUM'>Locum</Checkbox>
							</CheckboxGroup>

							<CheckboxGroup
								label='Work Mode'
								value={localFilters.workMode as string[]}
								onValueChange={value => handleLocalFilterChange({ workMode: value as readonly string[] })}
								className='w-full'
								classNames={{
									wrapper: 'flex-row flex-wrap gap-2'
								}}
							>
								<Checkbox value='REMOTE'>Remote</Checkbox>
								<Checkbox value='HYBRID'>Hybrid</Checkbox>
								<Checkbox value='OFFICE'>Office</Checkbox>
							</CheckboxGroup>

							<div className='w-full flex flex-col gap-6'>
								<Slider
									label='Experience'
									formatOptions={{
										style: 'unit',
										unit: 'year'
									}}
									minValue={0}
									maxValue={30}
									step={1}
									value={localFilters.minExperience ?? 0}
									onChange={val => {
										const v = Array.isArray(val) ? val[0] : val;
										handleLocalFilterChange({ minExperience: v });
									}}
									showTooltip
									className='w-full'
								/>
								<Button
									size='sm'
									variant='ghost'
									className='w-full min-h-10 text-sm'
									onPress={() => handleLocalFilterChange({ minExperience: null })}
									isDisabled={localFilters.minExperience === null}
								>
									Clear
								</Button>
							</div>

							<div className='w-full flex flex-col gap-6'>
								<Slider
									label='Salary'
									minValue={0}
									maxValue={500000}
									formatOptions={{
										style: 'currency',
										currency: 'INR'
									}}
									step={1000}
									value={[localFilters.minSalary ?? 0, localFilters.maxSalary ?? 500000]}
									onChange={val => {
										const [min, max] = Array.isArray(val) ? val : [val, val];
										handleLocalFilterChange({
											minSalary: min,
											maxSalary: max
										});
									}}
									showTooltip
									className='w-full'
								/>
								<Button
									size='sm'
									variant='ghost'
									className='w-full min-h-10 text-sm'
									onPress={() => handleLocalFilterChange({ minSalary: null, maxSalary: null })}
									isDisabled={localFilters.minSalary === null && localFilters.maxSalary === null}
								>
									Clear
								</Button>
							</div>
						</div>
					</div>

					{/* Bottom Action Bar */}
					<div className='sticky bottom-0 bg-background border-t border-divider p-4 safe-area-inset-bottom'>
						<div className='flex items-center justify-between'>
							<Button color='primary' size='lg' onPress={handleApply} className='px-8'>
								Apply Filters
							</Button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>,
		portalContainer
	);
}
