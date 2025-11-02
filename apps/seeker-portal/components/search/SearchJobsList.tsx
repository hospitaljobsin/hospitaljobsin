import { Card, CardBody, Select, SelectItem } from '@heroui/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState, useTransition } from 'react';
import { useFragment, usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import { WindowVirtualizer } from 'virtua';
import type { SearchJobsListFragment$key } from '@/__generated__/SearchJobsListFragment.graphql';
import type { SearchJobsListInternalFragment$key } from '@/__generated__/SearchJobsListInternalFragment.graphql';
import type {
	JobSearchSortBy,
	JobTypeFilter,
	JobWorkModeFilter,
	SearchJobsListRefetchQuery as SearchClientComponentQueryType,
	SearchJobsListRefetchQuery$variables
} from '@/__generated__/SearchJobsListRefetchQuery.graphql';
import type { Filters } from '@/app/search/jobs-in/[location]/SearchViewLocationClientComponent';
import Job from '@/components/landing/Job';
import JobListSkeleton from '@/components/landing/JobListSkeleton';
import { APP_TITLE, REASONABLE_JOB_COUNT } from '@/lib/constants';
import usePageTitle from '@/lib/hooks/usePageTitle';
import OneStepCreateJobAlertModal from '../shared/OneStepCreateJobAlertModal';
import FallbackJobsListSkeleton from './FallbackJobsListSkeleton';

const FallbackJobsList = dynamic(() => import('./FallbackJobsList'), {
	ssr: false,
	loading: () => <FallbackJobsListSkeleton />
});

const SearchJobsListFragment = graphql`
fragment SearchJobsListFragment on Query @argumentDefinitions(
	proximityKm: { type: "Float", defaultValue: null }
	searchTerm: { type: "String", defaultValue: null }
	minExperience: { type: "Int", defaultValue: null }
	minSalary: { type: "Int", defaultValue: null }
	maxSalary: { type: "Int", defaultValue: null }
	location: { type: "String", defaultValue: null }
	workMode: { type: "[JobWorkModeFilter!]!" }
	jobType: { type: "[JobTypeFilter!]!" }
	sortBy: { type: "JobSearchSortBy", defaultValue: RELEVANCE }
) {
	...SearchJobsListInternalFragment @arguments(searchTerm: $searchTerm, proximityKm: $proximityKm, minExperience: $minExperience, minSalary: $minSalary, maxSalary: $maxSalary, workMode: $workMode, jobType: $jobType, sortBy: $sortBy, location: $location)
	viewer {
		...JobControlsAuthFragment
		...FallbackJobsListAccountFragment
	}
}
`;

const SearchJobsListInternalFragment = graphql`
  fragment SearchJobsListInternalFragment on Query
  @refetchable(queryName: "SearchJobsListRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
	proximityKm: { type: "Float", defaultValue: null }
    searchTerm: { type: "String", defaultValue: null }
    count: { type: "Int", defaultValue: 25 }
	minExperience: { type: "Int", defaultValue: null }
	minSalary: { type: "Int", defaultValue: null }
	maxSalary: { type: "Int", defaultValue: null }
	location: { type: "String", defaultValue: null }
	workMode: { type: "[JobWorkModeFilter!]!" }
	jobType: { type: "[JobTypeFilter!]!" }
    sortBy: { type: "JobSearchSortBy", defaultValue: RELEVANCE }
  ){
    jobs(after: $cursor, first: $count, searchTerm: $searchTerm, proximityKm: $proximityKm, minExperience: $minExperience, minSalary: $minSalary, maxSalary: $maxSalary, workMode: $workMode, jobType: $jobType, sortBy: $sortBy, location: $location)
      @connection(key: "JobListFragment_jobs", filters: ["searchTerm", "proximityKm", "minExperience", "minExperience", "minSalary", "maxSalary", "workMode", "jobType", "sortBy", "location"]) {
      totalCount @required(action: THROW)
	  edges {
        node {
          id
          ...JobFragment
		  ...JobControlsFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: SearchJobsListFragment$key;
	searchTerm: string | null;
	location?: string | null;
	proximityKm: number | null;
	minExperience?: number | null;
	minSalary?: number | null;
	maxSalary?: number | null;
	workMode?: string[];
	jobType?: string[];
	sortBy?: string;
	setFilters: (filters: Filters | ((prevFilters: Filters) => Filters)) => void;
};

export default function SearchJobsList({
	rootQuery,
	searchTerm,
	location,
	proximityKm,
	minExperience,
	minSalary,
	maxSalary,
	workMode,
	jobType,
	sortBy,
	setFilters
}: Props) {
	const [showAlertModal, setShowAlertModal] = useState(false);
	const [_isPending, startTransition] = useTransition();
	const root = useFragment(SearchJobsListFragment, rootQuery);
	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		SearchClientComponentQueryType,
		SearchJobsListInternalFragment$key
	>(SearchJobsListInternalFragment, root);
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const hasMountedRef = useRef(false);

	// Flatten all job edges for virtualizer
	const allJobEdges = data.jobs.edges;
	const hasNextPage = data.jobs.pageInfo.hasNextPage;

	// Handle infinite scroll when reaching the end
	const handleScrollEnd = () => {
		if (hasNextPage && !isLoadingNext) {
			loadNext(25);
		}
	};

	usePageTitle({
		title: (() => {
			const hasReasonableCount = data.jobs.totalCount && data.jobs.totalCount >= REASONABLE_JOB_COUNT;

			let title = hasReasonableCount ? `${data.jobs.totalCount} Hospital Jobs` : 'Hospital Jobs';

			if (searchTerm) {
				title = hasReasonableCount ? `${data.jobs.totalCount} ${searchTerm} Hospital Jobs` : `${searchTerm} Hospital Jobs`;
			}

			if (location) {
				title += ` in ${location}`;
			}

			return `${title} | ${APP_TITLE}`;
		})()
	});

	// Debounced filter refetch for all filters
	useEffect(() => {
		if (!hasMountedRef.current) {
			hasMountedRef.current = true;
			return;
		}
		const debounceTimeout = setTimeout(() => {
			startTransition(() => {
				// Only include defined variables
				const refetchVars: SearchJobsListRefetchQuery$variables = {
					searchTerm,
					location,
					proximityKm,
					workMode: (workMode || []) as readonly JobWorkModeFilter[],
					jobType: (jobType || []) as readonly JobTypeFilter[],
					sortBy: sortBy as JobSearchSortBy
				};
				if (typeof minExperience !== 'undefined') refetchVars.minExperience = minExperience;
				if (typeof minSalary !== 'undefined') refetchVars.minSalary = minSalary;
				if (typeof maxSalary !== 'undefined') refetchVars.maxSalary = maxSalary;
				refetch(refetchVars, { fetchPolicy: 'network-only' });
			});
		}, 300);
		return () => clearTimeout(debounceTimeout);
	}, [refetch, searchTerm, location, proximityKm, minExperience, minSalary, maxSalary, workMode, jobType, sortBy]);

	if (allJobEdges.length === 0 && !hasNextPage) {
		return (
			<>
				<div className='w-full h-full flex flex-col gap-12'>
					<Card className='p-4' fullWidth shadow='none'>
						<CardBody className='flex flex-col sm:flex-row gap-6 w-full items-center justify-center'>
							<Image src='/illustrations/empty.svg' alt='No jobs found' width={200} height={200} />
							<div className='flex flex-col gap-4 items-center'>
								<h2 className='font-medium text-muted-foreground text-base text-center'>
									No jobs found{searchTerm ? ` for "${searchTerm}"` : ''}
									{location ? ` in ${location}` : ''}.
								</h2>
								<p className='text-muted-foreground text-sm text-center max-w-xs'>
									Try searching for another keyword or check for spelling errors in your search query.
								</p>
								<p className='text-muted-foreground text-sm text-center max-w-xs'>
									<span>
										<button
											type='button'
											onClick={() => {
												setShowAlertModal(true);
											}}
											className='cursor-pointer font-medium text-primary underline underline-offset-2 hover:text-primary/80 focus:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-colors duration-200 ease-in-out px-0 py-0 bg-transparent border-0 align-baseline'
											aria-label='Create a job alert to get notified when new jobs are posted'
										>
											Create a job alert
										</button>{' '}
										to get notified when new jobs are posted.
									</span>
								</p>
							</div>
						</CardBody>
					</Card>
					<Suspense fallback={<FallbackJobsListSkeleton />}>
						<FallbackJobsList viewer={root.viewer} />
					</Suspense>
				</div>
				<OneStepCreateJobAlertModal
					isOpen={showAlertModal}
					onOpenChange={setShowAlertModal}
					filters={{
						searchTerm: searchTerm || '',
						location,
						minExperience,
						minSalary,
						maxSalary,
						workMode: workMode || [],
						jobType: jobType || []
					}}
				/>
			</>
		);
	}

	return (
		<div className='w-full h-full'>
			<div className='w-full flex gap-12 justify-between items-center mb-6 sm:mb-8'>
				<div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
					<h2 className='text-base sm:text-lg text-foreground-600 whitespace-nowrap'>
						<span className='font-medium'>{data.jobs.totalCount}</span>{' '}
						{searchTerm ? <span className='font-medium'>{searchTerm}</span> : ' hospital'}
						{location ? ` jobs found in ${location}` : ' jobs found'}
					</h2>
					<a
						href={pathName.replace('/search', '/search/map') + searchParams.toString()}
						className='text-sm text-primary hover:text-primary/80 underline underline-offset-2 whitespace-nowrap'
					>
						View in map
					</a>
				</div>
				<div className='flex gap-2 w-full sm:max-w-xs'>
					<Select
						label='Sort by'
						placeholder='Select sorting option'
						selectedKeys={[sortBy || 'RELEVANCE']}
						onSelectionChange={keys => {
							const selectedKey = Array.from(keys)[0] as string;
							if (selectedKey) {
								startTransition(() => {
									setFilters((prevFilters: Filters) => ({
										...prevFilters,
										sortBy: selectedKey
									}));
								});
							}
						}}
						variant='faded'
						size='sm'
					>
						<SelectItem key='RELEVANCE'>Relevance</SelectItem>
						<SelectItem key='UPDATED_AT'>Date Posted</SelectItem>
					</Select>
				</div>
			</div>
			<div className='w-full h-full overflow-y-auto'>
				<WindowVirtualizer
					onScrollEnd={handleScrollEnd}
					ssrCount={10}
					count={hasNextPage ? allJobEdges.length + 1 : allJobEdges.length}
					overscan={5}
					onScroll={() => {
						console.log('SCROLLING>>>>');
					}}
					shift={false}
					itemSize={350}
				>
					{index => {
						const jobEdge = allJobEdges[index];
						if (index === allJobEdges.length) {
							return <JobListSkeleton />;
						}

						return (
							<div key={jobEdge.node.id} className='pb-4 sm:pb-6'>
								<Job job={jobEdge.node} authQueryRef={root.viewer} />
							</div>
						);
					}}
				</WindowVirtualizer>
			</div>
		</div>
	);
}
