'use client';

import { Button, Input } from '@heroui/react';
import { MapPin, Search, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { SearchLocation } from '@/components/forms/LocationAutocomplete';

interface FloatingSearchBarProps {
	searchTerm: string | null;
	location: string | null;
	onSearchTermChange?: (term: string | null) => void;
	onLocationChange?: (location: string | null) => void;
	onLocationSelect?: (location: SearchLocation) => void;
	onExpand?: () => void;
	isCompact?: boolean;
	className?: string;
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
	isCompact = true,
	className = ''
}: FloatingSearchBarProps) {
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [isLocationFocused, setIsLocationFocused] = useState(false);
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
	const [localLocation, setLocalLocation] = useState(location || '');

	const handleSearchSubmit = useCallback(() => {
		onSearchTermChange?.(localSearchTerm.trim() || null);
	}, [localSearchTerm, onSearchTermChange]);

	const handleLocationSubmit = useCallback(() => {
		onLocationChange?.(localLocation.trim() || null);
	}, [localLocation, onLocationChange]);

	const handleSearchClear = useCallback(() => {
		setLocalSearchTerm('');
		onSearchTermChange?.(null);
	}, [onSearchTermChange]);

	const handleLocationClear = useCallback(() => {
		setLocalLocation('');
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

	if (isCompact) {
		return (
			<div className={`absolute top-4 left-4 right-4 z-[1000] ${className}`}>
				<div className='bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-divider p-3'>
					<div className='flex items-center gap-2'>
						{/* Search Input */}
						<div className='flex-1 relative'>
							<Input
								value={localSearchTerm}
								onValueChange={setLocalSearchTerm}
								onFocusChange={setIsSearchFocused}
								onKeyDown={e => handleKeyDown(e, 'search')}
								placeholder='Search jobs...'
								variant='flat'
								size='sm'
								startContent={<Search size={16} className='text-default-400' />}
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
									mainWrapper: 'h-8',
									input: 'text-sm',
									inputWrapper: 'h-8 min-h-unit-8 bg-background/50'
								}}
							/>
						</div>

						{/* Location Input */}
						<div className='flex-1 relative'>
							<Input
								value={localLocation}
								onValueChange={setLocalLocation}
								onFocusChange={setIsLocationFocused}
								onKeyDown={e => handleKeyDown(e, 'location')}
								placeholder='City, state...'
								variant='flat'
								size='sm'
								startContent={<MapPin size={16} className='text-default-400' />}
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
									mainWrapper: 'h-8',
									input: 'text-sm',
									inputWrapper: 'h-8 min-h-unit-8 bg-background/50'
								}}
							/>
						</div>

						{/* Expand Button */}
						{onExpand && (
							<Button
								size='sm'
								variant='flat'
								onPress={onExpand}
								className='px-3 h-8 min-w-unit-12 bg-background/50'
								aria-label='Show more filters'
							>
								Filters
							</Button>
						)}
					</div>

					{/* Active State Indicator */}
					{(isSearchFocused || isLocationFocused) && (
						<div className='mt-2 text-xs text-default-500'>Press Enter to search • Click outside to close</div>
					)}
				</div>
			</div>
		);
	}

	// Expanded version with more controls
	return (
		<div className={`absolute top-4 left-4 right-4 z-[1000] ${className}`}>
			<div className='bg-background/95 backdrop-blur-sm rounded-xl shadow-xl border border-divider p-4'>
				<div className='space-y-3'>
					{/* Search Row */}
					<div className='flex items-center gap-3'>
						<div className='flex-1'>
							<Input
								value={localSearchTerm}
								onValueChange={setLocalSearchTerm}
								onKeyDown={e => handleKeyDown(e, 'search')}
								placeholder='Job title, company, or skills...'
								variant='bordered'
								size='md'
								startContent={<Search size={18} className='text-default-400' />}
								endContent={
									localSearchTerm && (
										<Button isIconOnly size='sm' variant='light' onPress={handleSearchClear} aria-label='Clear search'>
											<X size={14} />
										</Button>
									)
								}
								classNames={{
									input: 'text-sm'
								}}
							/>
						</div>
						<Button color='primary' size='md' onPress={handleSearchSubmit} className='px-6'>
							Search
						</Button>
					</div>

					{/* Location Row */}
					<div className='flex items-center gap-3'>
						<div className='flex-1'>
							<Input
								value={localLocation}
								onValueChange={setLocalLocation}
								onKeyDown={e => handleKeyDown(e, 'location')}
								placeholder='City, state, or pincode...'
								variant='bordered'
								size='md'
								startContent={<MapPin size={18} className='text-default-400' />}
								endContent={
									localLocation && (
										<Button isIconOnly size='sm' variant='light' onPress={handleLocationClear} aria-label='Clear location'>
											<X size={14} />
										</Button>
									)
								}
								classNames={{
									input: 'text-sm'
								}}
							/>
						</div>
						<Button color='secondary' variant='flat' size='md' onPress={handleLocationSubmit} className='px-6'>
							Apply
						</Button>
					</div>

					{/* Quick Actions */}
					<div className='flex items-center justify-between'>
						<div className='flex gap-2'>
							<Button size='sm' variant='flat' className='text-xs'>
								Remote Jobs
							</Button>
							<Button size='sm' variant='flat' className='text-xs'>
								Full Time
							</Button>
							<Button size='sm' variant='flat' className='text-xs'>
								High Salary
							</Button>
						</div>

						{onExpand && (
							<Button size='sm' variant='light' onPress={onExpand} className='text-xs'>
								More Filters →
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
