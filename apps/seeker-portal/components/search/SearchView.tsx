'use client';
import type { SearchView_query$key } from '@/__generated__/SearchView_query.graphql';
import { FILTER_DEFAULTS } from '@/lib/constants';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, useDisclosure } from '@heroui/react';
import { FilterIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { graphql, useFragment } from 'react-relay';
import type { FilterValues } from './FilterSidebar';
import FilterSidebar from './FilterSidebar';
import SearchHeaderSkeleton from './SearchHeaderSkeleton';
import SearchJobsList from './SearchJobsList';

const SearchHeaderClientComponent = dynamic(() => import('./SearchHeaderClientComponent'), {
	ssr: false,
	loading: () => <SearchHeaderSkeleton />
});

export const SearchPageContentFragment = graphql`
  fragment SearchView_query on Query
  @argumentDefinitions(
    searchTerm: { type: "String" }
    minExperience: { type: "Int" }
    minSalary: { type: "Int" }
    maxSalary: { type: "Int" }
	location: { type: "String" }
    proximityKm: { type: "Float" }
    workMode: { type: "[JobWorkModeFilter!]!" }
    jobType: { type: "[JobTypeFilter!]!" }
    sortBy: { type: "JobSearchSortBy" }
  ) {
    ...SearchJobsListFragment @arguments(
      searchTerm: $searchTerm
      proximityKm: $proximityKm
      minExperience: $minExperience
      minSalary: $minSalary
      maxSalary: $maxSalary
	  location: $location
	  jobType: $jobType
	  workMode: $workMode
      sortBy: $sortBy
    )
  }
`;

// Valid enum values for validation
const VALID_WORK_MODES = ['HYBRID', 'OFFICE', 'REMOTE'] as const;
const VALID_JOB_TYPES = ['CONTRACT', 'FULL_TIME', 'INTERNSHIP', 'LOCUM', 'PART_TIME'] as const;
const VALID_SORT_BY = ['RELEVANCE', 'UPDATED_AT'] as const;

// Function to validate enum arrays and return empty array if invalid
const validateEnumArray = <T extends string>(values: string[] | null | undefined, validValues: readonly T[]): T[] => {
	if (!values || !Array.isArray(values)) return [];
	return values.filter(value => validValues.includes(value as T)) as T[];
};

// Function to validate single enum value and return default if invalid
const validateEnum = <T extends string>(value: string | null | undefined, validValues: readonly T[], defaultValue: T): T => {
	if (!value || !validValues.includes(value as T)) return defaultValue;
	return value as T;
};

export default function SearchView({
	location,
	speciality,
	fragmentKey,
	filters,
	setFilters
}: {
	location: string | null;
	speciality: string | null;
	fragmentKey: SearchView_query$key;
	filters: FilterValues;
	setFilters: (filters: FilterValues | ((prevFilters: FilterValues) => FilterValues)) => void;
}) {
	const data = useFragment<SearchView_query$key>(SearchPageContentFragment, fragmentKey);

	// Fix: Only validate and update workMode/jobType/sortBy if actually needed, and only depend on those fields
	const { workMode, jobType, sortBy } = filters;

	useEffect(() => {
		const validatedWorkMode = validateEnumArray(workMode, VALID_WORK_MODES);
		const validatedJobType = validateEnumArray(jobType, VALID_JOB_TYPES);
		const validatedSortBy = validateEnum(sortBy, VALID_SORT_BY, 'RELEVANCE');

		if (
			JSON.stringify(validatedWorkMode) !== JSON.stringify(workMode) ||
			JSON.stringify(validatedJobType) !== JSON.stringify(jobType) ||
			validatedSortBy !== sortBy
		) {
			setFilters({
				...filters,
				workMode: validatedWorkMode.length > 0 ? validatedWorkMode : FILTER_DEFAULTS.workMode,
				jobType: validatedJobType.length > 0 ? validatedJobType : FILTER_DEFAULTS.jobType,
				sortBy: validatedSortBy
			});
		}
	}, [workMode, jobType, sortBy, setFilters, filters]);

	// Get validated values for use in render
	const validatedWorkMode = validateEnumArray(workMode, VALID_WORK_MODES);
	const validatedJobType = validateEnumArray(jobType, VALID_JOB_TYPES);
	const validatedSortBy = validateEnum(sortBy, VALID_SORT_BY, 'RELEVANCE');

	// When passing to FilterSidebar and JobList, treat undefined as null
	const sidebarFilters = {
		...filters,
		minExperience: filters.minExperience ?? null,
		minSalary: filters.minSalary ?? null,
		maxSalary: filters.maxSalary ?? null
	};

	// Debounced filter update: update key to force JobList remount/refetch
	// (Optional: If you want to debounce, you can use a useEffect with a timeout)

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<div className='w-full flex flex-col h-full min-h-screen bg-background-600'>
			<SearchHeaderClientComponent searchTerm={speciality} location={location} />
			<div className='flex flex-col lg:flex-row w-full gap-4 lg:gap-8 mx-auto max-w-7xl py-6 px-4 bg-background-600 flex-1'>
				{/* Mobile filter button */}
				<div className='block lg:hidden mb-4'>
					<Button variant='solid' startContent={<FilterIcon size={18} />} onPress={onOpen} fullWidth>
						Show Filters
					</Button>
					<Drawer
						isOpen={isOpen}
						onClose={onOpenChange}
						classNames={{
							body: 'px-0',
							wrapper: 'lg:hidden',
							backdrop: 'lg:hidden'
						}}
						placement='bottom'
					>
						<DrawerContent>
							<DrawerHeader>Filters</DrawerHeader>
							<DrawerBody>
								<FilterSidebar
									location={location}
									speciality={speciality}
									values={sidebarFilters}
									onChange={setFilters}
									open={true}
									filters={filters}
								/>
							</DrawerBody>
						</DrawerContent>
					</Drawer>
				</div>
				{/* Desktop sidebar */}
				<div className='hidden lg:block lg:w-auto lg:sticky lg:top-0 lg:self-start lg:overflow-y-auto h-full'>
					<FilterSidebar
						location={location}
						speciality={speciality}
						values={sidebarFilters}
						onChange={setFilters}
						open={true}
						filters={filters}
					/>
				</div>
				<div className='flex-1 w-full h-full'>
					<SearchJobsList
						rootQuery={data}
						searchTerm={speciality}
						location={location}
						proximityKm={filters.proximityKm}
						minExperience={filters.minExperience ?? null}
						minSalary={filters.minSalary ?? null}
						maxSalary={filters.maxSalary ?? null}
						workMode={validatedWorkMode}
						jobType={validatedJobType}
						sortBy={validatedSortBy}
						setFilters={setFilters as (filters: unknown) => void}
					/>
				</div>
			</div>
		</div>
	);
}
