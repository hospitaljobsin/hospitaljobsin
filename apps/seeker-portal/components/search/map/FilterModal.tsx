'use client';

import { Button, Checkbox, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Slider } from '@heroui/react';
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
		workMode: string[];
		jobType: string[];
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
							<CheckboxGroup
								label='Job Type'
								value={localFilters.jobType}
								onValueChange={value => handleLocalFilterChange({ jobType: value })}
								className='w-full'
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
								value={localFilters.workMode}
								onValueChange={value => handleLocalFilterChange({ workMode: value })}
								className='w-full'
								orientation='horizontal'
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
