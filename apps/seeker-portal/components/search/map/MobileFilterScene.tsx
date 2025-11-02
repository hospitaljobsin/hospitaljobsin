'use client';

import { Button, Chip } from '@heroui/react';
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
	quickFilters?: Array<{ label: string; value: string; active: boolean }>;
	onQuickFilterToggle?: (value: string) => void;
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
	quickFilters = [],
	onQuickFilterToggle,
	resultCount = 0,
	initialFocus = 'search'
}: MobileFilterSceneProps) {
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
	const [localLocation, setLocalLocation] = useState(location || '');
	const [activeInput, setActiveInput] = useState<'search' | 'location'>(initialFocus);
	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

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

	// Debounced updates
	useEffect(() => {
		if (localSearchTerm !== (searchTerm || '')) {
			const timeoutId = setTimeout(() => {
				onSearchTermChange?.(localSearchTerm.trim() || null);
			}, 400);
			return () => clearTimeout(timeoutId);
		}
	}, [localSearchTerm, searchTerm, onSearchTermChange]);

	useEffect(() => {
		if (localLocation !== (location || '')) {
			const timeoutId = setTimeout(() => {
				onLocationChange?.(localLocation.trim() || null);
			}, 400);
			return () => clearTimeout(timeoutId);
		}
	}, [localLocation, location, onLocationChange]);

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
		onClose();
	}, [localSearchTerm, localLocation, onSearchTermChange, onLocationChange, onClose]);

	// Generate additional filter sections based on current filters
	const jobTypeFilters = [
		{ label: 'Full-time', value: 'full_time', active: filters.jobType?.includes('full_time') || false },
		{ label: 'Part-time', value: 'part_time', active: filters.jobType?.includes('part_time') || false },
		{ label: 'Contract', value: 'contract', active: filters.jobType?.includes('contract') || false },
		{ label: 'Temporary', value: 'temporary', active: filters.jobType?.includes('temporary') || false }
	];

	const workModeFilters = [
		{ label: 'Remote', value: 'remote', active: filters.workMode?.includes('remote') || false },
		{ label: 'Hybrid', value: 'hybrid', active: filters.workMode?.includes('hybrid') || false },
		{ label: 'Office', value: 'office', active: filters.workMode?.includes('office') || false }
	];

	const experienceFilters = [
		{ label: 'Entry Level', value: '0', active: filters.minExperience === 0 },
		{ label: 'Mid Level', value: '2', active: filters.minExperience === 2 },
		{ label: 'Senior Level', value: '5', active: filters.minExperience === 5 },
		{ label: 'Executive', value: '10', active: filters.minExperience === 10 }
	];

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
							/>
						</div>
					</div>

					{/* Filters Content */}
					<div className='flex-1 overflow-y-auto px-4 pb-20'>
						<div className='space-y-6'>
							{/* Quick Filters */}
							{quickFilters.length > 0 && (
								<div>
									<h3 className='text-sm font-medium text-foreground-700 mb-3'>Quick Filters</h3>
									<div className='flex flex-wrap gap-2'>
										{quickFilters.map(filter => (
											<Chip
												key={filter.value}
												size='md'
												variant={filter.active ? 'solid' : 'flat'}
												color={filter.active ? 'primary' : 'default'}
												className='cursor-pointer transition-all'
												onClick={() => onQuickFilterToggle?.(filter.value)}
											>
												{filter.label}
											</Chip>
										))}
									</div>
								</div>
							)}

							{/* Job Type */}
							<div>
								<h3 className='text-sm font-medium text-foreground-700 mb-3'>Job Type</h3>
								<div className='flex flex-wrap gap-2'>
									{jobTypeFilters.map(filter => (
										<Chip
											key={filter.value}
											size='md'
											variant={filter.active ? 'solid' : 'flat'}
											color={filter.active ? 'primary' : 'default'}
											className='cursor-pointer transition-all'
											onClick={() => {
												const currentTypes = filters.jobType || [];
												const newTypes = filter.active ? currentTypes.filter(t => t !== filter.value) : [...currentTypes, filter.value];
												onFiltersChange?.({ jobType: newTypes });
											}}
										>
											{filter.label}
										</Chip>
									))}
								</div>
							</div>

							{/* Work Mode */}
							<div>
								<h3 className='text-sm font-medium text-foreground-700 mb-3'>Work Mode</h3>
								<div className='flex flex-wrap gap-2'>
									{workModeFilters.map(filter => (
										<Chip
											key={filter.value}
											size='md'
											variant={filter.active ? 'solid' : 'flat'}
											color={filter.active ? 'primary' : 'default'}
											className='cursor-pointer transition-all'
											onClick={() => {
												const currentModes = filters.workMode || [];
												const newModes = filter.active ? currentModes.filter(m => m !== filter.value) : [...currentModes, filter.value];
												onFiltersChange?.({ workMode: newModes });
											}}
										>
											{filter.label}
										</Chip>
									))}
								</div>
							</div>

							{/* Experience Level */}
							<div>
								<h3 className='text-sm font-medium text-foreground-700 mb-3'>Experience Level</h3>
								<div className='flex flex-wrap gap-2'>
									{experienceFilters.map(filter => (
										<Chip
											key={filter.value}
											size='md'
											variant={filter.active ? 'solid' : 'flat'}
											color={filter.active ? 'primary' : 'default'}
											className='cursor-pointer transition-all'
											onClick={() => {
												const newExperience = filter.active ? null : Number.parseInt(filter.value, 10);
												onFiltersChange?.({ minExperience: newExperience });
											}}
										>
											{filter.label}
										</Chip>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Bottom Action Bar */}
					<div className='sticky bottom-0 bg-background border-t border-divider p-4 safe-area-inset-bottom'>
						<div className='flex items-center justify-between'>
							<div className='text-sm text-foreground-500'>{resultCount > 0 ? `${resultCount} jobs found` : 'No jobs found'}</div>
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
