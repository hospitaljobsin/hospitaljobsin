'use client';

import { Button, Chip, Input } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, MapPin, Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { SearchLocation } from '@/components/forms/LocationAutocomplete';
import { filterChipsExpand, filterChipsTransition, getAnimationConfig } from '@/lib/animations';
import MobileFilterScene from './MobileFilterScene';

interface FloatingSearchBarProps {
	searchTerm: string | null;
	location: string | null;
	onSearchTermChange?: (term: string | null) => void;
	onLocationChange?: (location: string | null) => void;
	onLocationSelect?: (location: SearchLocation) => void;
	onExpand?: () => void;
	isCompact?: boolean;
	className?: string;
	// New props for enhanced functionality
	showFiltersButton?: boolean;
	activeFilterCount?: number;
	onFiltersClick?: () => void;
	onFocusChange?: (focused: boolean) => void;
	// Mobile enhancement props
	isMobile?: boolean;
	quickFilters?: Array<{ label: string; value: string; active: boolean }>;
	onQuickFilterToggle?: (value: string) => void;
	onMoreFiltersClick?: () => void;
	// Mobile filter scene props
	filters?: {
		jobType: readonly string[];
		workMode: readonly string[];
		minExperience: number | null;
		minSalary: number | null;
		maxSalary: number | null;
	};
	onFiltersChange?: (filters: Partial<FloatingSearchBarProps['filters']>) => void;
	resultCount?: number;
}

/**
 * FloatingSearchBar Component
 *
 * A compact search bar that floats over the map for quick search functionality.
 * Can expand to show more detailed filters or remain compact for minimal UI footprint.
 */
export default function FloatingSearchBar({
	searchTerm,
	location,
	onSearchTermChange,
	onLocationChange,
	onLocationSelect: _onLocationSelect,
	onExpand,
	className = '',
	showFiltersButton = false,
	activeFilterCount = 0,
	onFiltersClick,
	onFocusChange,
	isMobile = false,
	quickFilters = [],
	onQuickFilterToggle,
	onMoreFiltersClick,
	filters,
	onFiltersChange,
	resultCount = 0
}: FloatingSearchBarProps) {
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
	const [localLocation, setLocalLocation] = useState(location || '');
	// Mobile focus state management
	const [isFocused, setIsFocused] = useState(false);
	const [activeInput, setActiveInput] = useState<'search' | 'location' | null>(null);
	// Mobile filter scene state
	const [showMobileScene, setShowMobileScene] = useState(false);
	const [mobileSceneFocus, setMobileSceneFocus] = useState<'search' | 'location'>('search');

	// Sync local state with external prop changes
	useEffect(() => {
		setLocalSearchTerm(searchTerm || '');
	}, [searchTerm]);

	useEffect(() => {
		setLocalLocation(location || '');
	}, [location]);

	// Debounced search - automatically search after user stops typing for 800ms
	useEffect(() => {
		if (localSearchTerm !== (searchTerm || '')) {
			const timeoutId = setTimeout(() => {
				onSearchTermChange?.(localSearchTerm.trim() || null);
			}, 800);

			return () => clearTimeout(timeoutId);
		}
	}, [localSearchTerm, searchTerm, onSearchTermChange]);

	useEffect(() => {
		if (localLocation !== (location || '')) {
			const timeoutId = setTimeout(() => {
				onLocationChange?.(localLocation.trim() || null);
			}, 800);

			return () => clearTimeout(timeoutId);
		}
	}, [localLocation, location, onLocationChange]);

	const handleSearchSubmit = useCallback(() => {
		onSearchTermChange?.(localSearchTerm.trim() || null);
	}, [localSearchTerm, onSearchTermChange]);

	const handleLocationSubmit = useCallback(() => {
		onLocationChange?.(localLocation.trim() || null);
	}, [localLocation, onLocationChange]);

	const handleSearchClear = useCallback(() => {
		setLocalSearchTerm('');
		// Immediately trigger search change to refetch results
		onSearchTermChange?.(null);
	}, [onSearchTermChange]);

	const handleLocationClear = useCallback(() => {
		setLocalLocation('');
		// Immediately trigger location change to refetch results
		onLocationChange?.(null);
	}, [onLocationChange]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent, type: 'search' | 'location') => {
			if (e.key === 'Enter') {
				e.preventDefault();
				if (type === 'search') {
					handleSearchSubmit();
				} else {
					handleLocationSubmit();
				}
			}
		},
		[handleSearchSubmit, handleLocationSubmit]
	);

	// Handle input focus for mobile enhancement
	const handleInputFocus = useCallback(
		(type: 'search' | 'location') => {
			if (isMobile) {
				// On mobile, open the dedicated filter scene
				setMobileSceneFocus(type);
				setShowMobileScene(true);
			} else {
				// On desktop, use the existing focus behavior
				setIsFocused(true);
				setActiveInput(type);
				onFocusChange?.(true);
			}
		},
		[isMobile, onFocusChange]
	);

	const handleInputBlur = useCallback(() => {
		// Delay to allow for interaction with suggestions and filter chips
		setTimeout(() => {
			setIsFocused(false);
			setActiveInput(null);
			onFocusChange?.(false);
		}, 150);
	}, [onFocusChange]);

	const handleMobileSceneClose = useCallback(() => {
		setShowMobileScene(false);
		onFocusChange?.(false);
	}, [onFocusChange]);

	return (
		<motion.div layout className={`absolute top-4 left-4 right-4 z-[1000] ${className}`}>
			<div className='bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-divider'>
				{/* Main Search Container */}
				<div className='p-3'>
					<div className='flex items-center gap-2'>
						{/* Search Input */}
						<Input
							value={localSearchTerm}
							onValueChange={setLocalSearchTerm}
							onKeyDown={e => handleKeyDown(e, 'search')}
							onFocus={() => handleInputFocus('search')}
							onBlur={handleInputBlur}
							placeholder='Search jobs...'
							variant='flat'
							aria-label='Search for job titles, companies, or skills'
							startContent={<Search size={16} className='text-default-400' aria-hidden='true' />}
							endContent={
								localSearchTerm && (
									<Button
										isIconOnly
										size='sm'
										variant='light'
										onPress={handleSearchClear}
										className='min-w-unit-6 w-6 h-6'
										aria-label='Clear search'
									>
										<X size={12} />
									</Button>
								)
							}
							classNames={{
								base: 'max-w-none',
								input: 'text-sm'
							}}
						/>

						{/* Location Input */}
						<Input
							value={localLocation}
							onValueChange={setLocalLocation}
							onKeyDown={e => handleKeyDown(e, 'location')}
							onFocus={() => handleInputFocus('location')}
							onBlur={handleInputBlur}
							placeholder='City, state...'
							variant='flat'
							aria-label='Search by city, state, or area'
							startContent={<MapPin size={16} className='text-default-400' aria-hidden='true' />}
							endContent={
								localLocation && (
									<Button
										isIconOnly
										size='sm'
										variant='light'
										onPress={handleLocationClear}
										className='min-w-unit-6 w-6 h-6'
										aria-label='Clear location'
									>
										<X size={12} />
									</Button>
								)
							}
							classNames={{
								base: 'max-w-none',
								input: 'text-sm'
							}}
						/>

						{/* Desktop Filters Button */}
						{showFiltersButton && !isMobile && (
							<Button
								size='sm'
								variant='flat'
								onPress={onFiltersClick}
								startContent={<Filter size={16} />}
								className='px-3 h-8 min-w-fit whitespace-nowrap bg-background/50'
								aria-label='Open filter modal'
							>
								{activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
							</Button>
						)}
					</div>
				</div>

				{/* Mobile Filter Chips - Show on focus (disabled, using dedicated scene) */}
				<AnimatePresence>
					{isFocused && !isMobile && quickFilters.length > 0 && (
						<motion.div
							{...getAnimationConfig(filterChipsExpand, filterChipsTransition)}
							className='border-t border-divider overflow-hidden'
						>
							<div className='p-3'>
								<div className='flex flex-wrap gap-2 items-center'>
									{/* Quick Filter Chips */}
									{quickFilters.map(filter => (
										<Chip
											key={filter.value}
											size='sm'
											variant={filter.active ? 'solid' : 'flat'}
											color={filter.active ? 'primary' : 'default'}
											className='cursor-pointer transition-colors'
											onClick={() => onQuickFilterToggle?.(filter.value)}
										>
											{filter.label}
										</Chip>
									))}

									{/* More Filters Button */}
									{onMoreFiltersClick && (
										<Button
											size='sm'
											variant='flat'
											onPress={onMoreFiltersClick}
											className='ml-auto bg-default-100 hover:bg-default-200 transition-colors'
										>
											+ More Filters
										</Button>
									)}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Mobile Filter Scene */}
			{isMobile && (
				<MobileFilterScene
					isOpen={showMobileScene}
					onClose={handleMobileSceneClose}
					searchTerm={searchTerm}
					location={location}
					onSearchTermChange={onSearchTermChange}
					onLocationChange={onLocationChange}
					onLocationSelect={_onLocationSelect}
					filters={
						filters || {
							jobType: [],
							workMode: [],
							minExperience: null,
							minSalary: null,
							maxSalary: null
						}
					}
					onFiltersChange={onFiltersChange}
					quickFilters={quickFilters}
					onQuickFilterToggle={onQuickFilterToggle}
					resultCount={resultCount}
					initialFocus={mobileSceneFocus}
				/>
			)}
		</motion.div>
	);
}
