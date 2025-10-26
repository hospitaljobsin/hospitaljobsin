'use client';

import { Button, Checkbox, CheckboxGroup, Slider } from '@heroui/react';
import JobSearchAutocomplete from '@/components/forms/JobSearchAutocomplete';
import LocationAutocomplete from '@/components/forms/LocationAutocomplete';

import type { SearchLocation } from '@/components/forms/LocationAutocomplete';

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
	onFiltersChange?: (filters: Partial<MapFilterSidebarProps['filters']>) => void;
	onLocationSelect?: (location: SearchLocation) => void;
	totalCount: number;
	isPending?: boolean;
}

export default function MapFilterSidebar({
	filters,
	onFiltersChange,
	onLocationSelect,
	totalCount,
	isPending = false
}: MapFilterSidebarProps) {
	const handleClearAll = () => {
		onFiltersChange?.({
			searchTerm: null,
			location: null,
			minExperience: null,
			minSalary: null,
			maxSalary: null,
			workMode: [],
			jobType: [],
			sortBy: 'RELEVANCE'
		});
	};

	const hasActiveFilters =
		filters.searchTerm ||
		filters.location ||
		filters.minExperience ||
		filters.minSalary ||
		filters.maxSalary ||
		filters.jobType.length > 0 ||
		filters.workMode.length > 0;

	return (
		<div className='py-6 sm:p-6 space-y-6'>
			<div>
				<h2 className='text-lg text-foreground-600 mb-1'>{totalCount} Jobs found</h2>
			</div>

			<JobSearchAutocomplete
				value={filters.searchTerm || ''}
				onValueChange={value => onFiltersChange?.({ searchTerm: value || null })}
				onSubmit={value => onFiltersChange?.({ searchTerm: value || null })}
				onClear={() => onFiltersChange?.({ searchTerm: null })}
				placeholder='Search job title or keyword...'
				variant='bordered'
			/>

			<LocationAutocomplete
				value={filters.location || ''}
				onChange={location => {
					onFiltersChange?.({ location: location.address.displayName || null });
					onLocationSelect?.(location);
				}}
				onValueChange={value => onFiltersChange?.({ location: value || null })}
				onSubmit={value => onFiltersChange?.({ location: value || null })}
				onClear={() => onFiltersChange?.({ location: null })}
				label='Location'
				placeholder='City, state or pincode...'
				variant='bordered'
			/>

			<CheckboxGroup
				label='Job Type'
				value={Array.from(filters.jobType)}
				onValueChange={value => onFiltersChange?.({ jobType: value })}
				orientation='horizontal'
			>
				<Checkbox value='FULL_TIME'>Full Time</Checkbox>
				<Checkbox value='PART_TIME'>Part Time</Checkbox>
				<Checkbox value='INTERNSHIP'>Internship</Checkbox>
				<Checkbox value='CONTRACT'>Contract</Checkbox>
				<Checkbox value='LOCUM'>Locum</Checkbox>
			</CheckboxGroup>

			<CheckboxGroup
				label='Work Mode'
				value={Array.from(filters.workMode)}
				onValueChange={value => onFiltersChange?.({ workMode: value })}
				orientation='horizontal'
			>
				<Checkbox value='REMOTE'>Remote</Checkbox>
				<Checkbox value='HYBRID'>Hybrid</Checkbox>
				<Checkbox value='OFFICE'>Office</Checkbox>
			</CheckboxGroup>

			<div className='space-y-4'>
				<Slider
					label='Experience'
					formatOptions={{
						style: 'unit',
						unit: 'year'
					}}
					minValue={0}
					maxValue={30}
					step={1}
					value={filters.minExperience ?? 0}
					onChange={val => {
						const v = Array.isArray(val) ? val[0] : val;
						onFiltersChange?.({ minExperience: v === 0 ? null : v });
					}}
					showTooltip
				/>
				{filters.minExperience !== null && (
					<Button size='sm' variant='ghost' fullWidth onPress={() => onFiltersChange?.({ minExperience: null })}>
						Clear Experience
					</Button>
				)}
			</div>

			<div className='space-y-4'>
				<Slider
					label='Salary Range'
					minValue={0}
					maxValue={500000}
					formatOptions={{
						style: 'currency',
						currency: 'INR'
					}}
					step={1000}
					value={[filters.minSalary ?? 0, filters.maxSalary ?? 500000]}
					onChange={val => {
						const [min, max] = Array.isArray(val) ? val : [val, val];
						onFiltersChange?.({
							minSalary: min === 0 ? null : min,
							maxSalary: max === 500000 ? null : max
						});
					}}
					showTooltip
				/>
				{(filters.minSalary !== null || filters.maxSalary !== null) && (
					<Button size='sm' variant='ghost' fullWidth onPress={() => onFiltersChange?.({ minSalary: null, maxSalary: null })}>
						Clear Salary
					</Button>
				)}
			</div>

			{hasActiveFilters && (
				<Button fullWidth variant='light' color='danger' onPress={handleClearAll} isDisabled={isPending}>
					Clear All Filters
				</Button>
			)}
		</div>
	);
}
