'use client';

import { Button, Slider } from '@heroui/react';
import JobSearchAutocomplete from '@/components/forms/JobSearchAutocomplete';
import type { SearchLocation } from '@/components/forms/LocationAutocomplete';
import LocationAutocomplete from '@/components/forms/LocationAutocomplete';
import ClusterJobsList from './ClusterJobsList';

type ClusterInfo = {
	hexId: string;
	count: number;
	center: [number, number];
};

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
	// Cluster support props
	selectedCluster?: ClusterInfo | null;
	onJobSelect?: (jobId: string) => void;
}

export default function MapFilterSidebar({
	filters,
	onFiltersChange,
	onLocationSelect,
	totalCount,
	isPending = false,
	selectedCluster,
	onJobSelect
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
		<div className='p-4 space-y-4'>
			{/* Compact Header with Count and Clear Action */}
			<div className='flex items-center justify-between'>
				<h2 className='text-base font-medium text-foreground-800'>{totalCount.toLocaleString()} Jobs</h2>
				{hasActiveFilters && (
					<Button size='sm' variant='light' color='danger' onPress={handleClearAll} isDisabled={isPending} className='text-xs px-2 h-6'>
						Clear All
					</Button>
				)}
			</div>

			{/* Compact Search Section */}
			<div className='space-y-2'>
				<JobSearchAutocomplete
					value={filters.searchTerm || ''}
					onValueChange={value => onFiltersChange?.({ searchTerm: value || null })}
					onSubmit={value => onFiltersChange?.({ searchTerm: value || null })}
					onClear={() => onFiltersChange?.({ searchTerm: null })}
					placeholder='Job title or keyword...'
					variant='flat'
					size='sm'
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
					placeholder='City, state or pincode...'
					variant='flat'
					size='sm'
				/>
			</div>

			{/* Quick Filter Chips */}
			<div className='space-y-2'>
				<div className='text-xs font-medium text-foreground-600 mb-1'>Job Type</div>
				<div className='flex flex-wrap gap-1'>
					{['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'LOCUM'].map(type => {
						const isSelected = filters.jobType.includes(type);
						const labels = {
							FULL_TIME: 'Full-time',
							PART_TIME: 'Part-time',
							INTERNSHIP: 'Internship',
							CONTRACT: 'Contract',
							LOCUM: 'Locum'
						};
						return (
							<Button
								key={type}
								size='sm'
								variant={isSelected ? 'solid' : 'flat'}
								color={isSelected ? 'primary' : 'default'}
								onPress={() => {
									const newJobTypes = isSelected ? filters.jobType.filter(t => t !== type) : [...filters.jobType, type];
									onFiltersChange?.({ jobType: newJobTypes });
								}}
								className='text-xs h-6 px-2 min-w-unit-12'
							>
								{labels[type as keyof typeof labels]}
							</Button>
						);
					})}
				</div>
			</div>

			<div className='space-y-2'>
				<div className='text-xs font-medium text-foreground-600 mb-1'>Work Mode</div>
				<div className='flex flex-wrap gap-1'>
					{['REMOTE', 'HYBRID', 'OFFICE'].map(mode => {
						const isSelected = filters.workMode.includes(mode);
						const labels = {
							REMOTE: 'Remote',
							HYBRID: 'Hybrid',
							OFFICE: 'Office'
						};
						return (
							<Button
								key={mode}
								size='sm'
								variant={isSelected ? 'solid' : 'flat'}
								color={isSelected ? 'secondary' : 'default'}
								onPress={() => {
									const newWorkModes = isSelected ? filters.workMode.filter(m => m !== mode) : [...filters.workMode, mode];
									onFiltersChange?.({ workMode: newWorkModes });
								}}
								className='text-xs h-6 px-2 min-w-unit-12'
							>
								{labels[mode as keyof typeof labels]}
							</Button>
						);
					})}
				</div>
			</div>

			{/* Compact Sliders */}
			<div className='space-y-3'>
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<span className='text-xs font-medium text-foreground-600'>Experience</span>
						{filters.minExperience !== null && (
							<Button
								size='sm'
								variant='light'
								onPress={() => onFiltersChange?.({ minExperience: null })}
								className='text-xs px-1 h-4 min-w-unit-8'
							>
								Clear
							</Button>
						)}
					</div>
					<Slider
						size='sm'
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
						className='w-full'
					/>
				</div>

				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<span className='text-xs font-medium text-foreground-600'>Salary Range</span>
						{(filters.minSalary !== null || filters.maxSalary !== null) && (
							<Button
								size='sm'
								variant='light'
								onPress={() => onFiltersChange?.({ minSalary: null, maxSalary: null })}
								className='text-xs px-1 h-4 min-w-unit-8'
							>
								Clear
							</Button>
						)}
					</div>
					<Slider
						size='sm'
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
						className='w-full'
					/>
				</div>
			</div>

			{/* Cluster Jobs List - shown when a cluster is auto-detected in viewport */}
			{selectedCluster && (
				<div className='border-t border-divider pt-4'>
					<div className='mb-3'>
						<h3 className='text-sm font-medium text-foreground-700 mb-1'>Jobs in Current Area</h3>
						<p className='text-xs text-foreground-500'>Showing {selectedCluster.count} jobs in the highlighted cluster</p>
					</div>
					<ClusterJobsList
						h3Index={selectedCluster.hexId}
						clusterInfo={{
							count: selectedCluster.count,
							center: selectedCluster.center
						}}
						filters={filters}
						onJobSelect={onJobSelect}
						className='max-h-96 overflow-y-auto'
					/>
				</div>
			)}
		</div>
	);
}
