'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Slider } from '@heroui/react';
import { Filter } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface FilterModalProps {
	isOpen: boolean;
	onClose: () => void;
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
	onFiltersChange?: (filters: Partial<FilterModalProps['filters']>) => void;
	resultCount: number;
	isPending?: boolean;
}

export default function FilterModal({ isOpen, onClose, filters, onFiltersChange, resultCount, isPending = false }: FilterModalProps) {
	const [localFilters, setLocalFilters] = useState(filters);

	// Sync local filters with props
	useEffect(() => {
		setLocalFilters(filters);
	}, [filters]);

	// Local filter updates
	const handleLocalFilterChange = useCallback((updates: Partial<typeof filters>) => {
		setLocalFilters(prev => ({ ...prev, ...updates }));
	}, []);

	// Apply filters
	const handleApply = useCallback(() => {
		onFiltersChange?.(localFilters);
		onClose();
	}, [localFilters, onFiltersChange, onClose]);

	// Clear all filters
	const handleClearAll = useCallback(() => {
		const clearedFilters = {
			minExperience: null,
			minSalary: null,
			maxSalary: null,
			workMode: [],
			jobType: [],
			sortBy: 'RELEVANCE'
		};
		setLocalFilters(prev => ({ ...prev, ...clearedFilters }));
		onFiltersChange?.(clearedFilters);
	}, [onFiltersChange]);

	// Count active filters
	const activeFilterCount =
		(localFilters.minExperience ? 1 : 0) +
		(localFilters.minSalary || localFilters.maxSalary ? 1 : 0) +
		localFilters.workMode.length +
		localFilters.jobType.length;

	const hasActiveFilters = activeFilterCount > 0;

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open: boolean) => !open && onClose()}
			size='4xl'
			backdrop='blur'
			scrollBehavior='inside'
			classNames={{
				base: 'max-h-[90vh]',
				body: 'py-6'
			}}
		>
			<ModalContent>
				{(onModalClose: () => void) => (
					<>
						<ModalHeader className='flex items-center justify-between'>
							<div>
								<div className='text-lg font-semibold text-foreground-700 flex items-center gap-2'>
									<Filter size={20} />
									Filter Jobs
								</div>
								<p className='text-sm text-foreground-500 mt-1 font-normal'>Refine your job search with detailed filters</p>
							</div>
						</ModalHeader>

						<ModalBody className='space-y-6'>
							{/* Job Type Filters */}
							<div className='space-y-3'>
								<h3 className='text-sm font-medium text-foreground-700'>Job Type</h3>
								<div className='flex flex-wrap gap-2'>
									{['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'LOCUM'].map(type => {
										const isSelected = localFilters.jobType.includes(type);
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
													const newJobType = isSelected ? localFilters.jobType.filter(t => t !== type) : [...localFilters.jobType, type];
													handleLocalFilterChange({ jobType: newJobType });
												}}
												className='text-xs'
											>
												{labels[type as keyof typeof labels]}
											</Button>
										);
									})}
								</div>
							</div>

							{/* Work Mode Filters */}
							<div className='space-y-3'>
								<h3 className='text-sm font-medium text-foreground-700'>Work Mode</h3>
								<div className='flex flex-wrap gap-2'>
									{['REMOTE', 'HYBRID', 'ON_SITE'].map(mode => {
										const isSelected = localFilters.workMode.includes(mode);
										const labels = {
											REMOTE: 'Remote',
											HYBRID: 'Hybrid',
											ON_SITE: 'On-site'
										};

										return (
											<Button
												key={mode}
												size='sm'
												variant={isSelected ? 'solid' : 'flat'}
												color={isSelected ? 'primary' : 'default'}
												onPress={() => {
													const newWorkMode = isSelected ? localFilters.workMode.filter(m => m !== mode) : [...localFilters.workMode, mode];
													handleLocalFilterChange({ workMode: newWorkMode });
												}}
												className='text-xs'
											>
												{labels[mode as keyof typeof labels]}
											</Button>
										);
									})}
								</div>
							</div>

							{/* Experience Range */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h3 className='text-sm font-medium text-foreground-700'>Experience</h3>
									{localFilters.minExperience !== null && (
										<Button
											size='sm'
											variant='light'
											onPress={() => handleLocalFilterChange({ minExperience: null })}
											className='text-xs px-2 h-6'
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
									value={localFilters.minExperience ?? 0}
									onChange={val => {
										const v = Array.isArray(val) ? val[0] : val;
										handleLocalFilterChange({ minExperience: v === 0 ? null : v });
									}}
									showTooltip
									className='w-full'
								/>
							</div>

							{/* Salary Range */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h3 className='text-sm font-medium text-foreground-700'>Salary Range</h3>
									{(localFilters.minSalary !== null || localFilters.maxSalary !== null) && (
										<Button
											size='sm'
											variant='light'
											onPress={() => handleLocalFilterChange({ minSalary: null, maxSalary: null })}
											className='text-xs px-2 h-6'
										>
											Clear
										</Button>
									)}
								</div>
								<div className='space-y-2'>
									<div>
										<div className='text-xs text-foreground-600 mb-1'>Minimum Salary</div>
										<Slider
											size='sm'
											formatOptions={{
												style: 'currency',
												currency: 'USD',
												notation: 'compact'
											}}
											minValue={20000}
											maxValue={200000}
											step={5000}
											value={localFilters.minSalary ?? 20000}
											onChange={val => {
												const v = Array.isArray(val) ? val[0] : val;
												handleLocalFilterChange({ minSalary: v === 20000 ? null : v });
											}}
											showTooltip
											className='w-full'
										/>
									</div>
									<div>
										<div className='text-xs text-foreground-600 mb-1'>Maximum Salary</div>
										<Slider
											size='sm'
											formatOptions={{
												style: 'currency',
												currency: 'USD',
												notation: 'compact'
											}}
											minValue={25000}
											maxValue={500000}
											step={5000}
											value={localFilters.maxSalary ?? 200000}
											onChange={val => {
												const v = Array.isArray(val) ? val[0] : val;
												handleLocalFilterChange({ maxSalary: v === 200000 ? null : v });
											}}
											showTooltip
											className='w-full'
										/>
									</div>
								</div>
							</div>
						</ModalBody>

						<ModalFooter className='justify-between'>
							<div className='flex items-center gap-3'>
								{hasActiveFilters && (
									<Button size='sm' variant='light' color='danger' onPress={handleClearAll} isDisabled={isPending}>
										Clear All
									</Button>
								)}
							</div>
							<div className='flex items-center gap-3'>
								<Button variant='flat' onPress={onModalClose} isDisabled={isPending}>
									Cancel
								</Button>
								<Button color='primary' onPress={handleApply} isLoading={isPending} className='min-w-24'>
									Apply ({resultCount.toLocaleString()})
								</Button>
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
