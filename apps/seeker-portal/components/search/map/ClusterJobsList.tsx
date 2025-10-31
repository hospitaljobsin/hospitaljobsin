import React, { Suspense, useEffect, useRef, useState } from 'react';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import type { ClusterJobsListInternalFragment$key } from '@/__generated__/ClusterJobsListInternalFragment.graphql';
import type { ClusterJobsListPaginationQuery } from '@/__generated__/ClusterJobsListPaginationQuery.graphql';
import type { ClusterJobsListQuery, JobTypeFilter, JobWorkModeFilter } from '@/__generated__/ClusterJobsListQuery.graphql';
import ClusterJobsListSkeleton from './ClusterJobsListSkeleton';
import CompactJobCard from './CompactJobCard';

// Error Boundary Component for Relay errors
class ViewportJobsErrorBoundary extends React.Component<{ children: React.ReactNode; onRetry?: () => void }, { hasError: boolean }> {
	constructor(props: { children: React.ReactNode; onRetry?: () => void }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ViewportJobsList Error:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='text-center py-8'>
					<p className='text-sm text-danger-600 mb-2'>Failed to load jobs</p>
					<button
						type='button'
						onClick={() => {
							this.setState({ hasError: false });
							this.props.onRetry?.();
						}}
						className='text-xs text-primary-600 hover:underline'
					>
						Try again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

// GraphQL query for viewport jobs
const ClusterJobsListQueryNode = graphql`
	query ClusterJobsListQuery(
		$bounds: BoundingBoxInput!
		$workMode: [JobWorkModeFilter!]!
		$jobType: [JobTypeFilter!]!
		$searchTerm: String
		$location: String
		$minExperience: Int
		$minSalary: Int
		$maxSalary: Int
		$proximityKm: Float
	) {
		...ClusterJobsListInternalFragment
			@arguments(
				bounds: $bounds
				workMode: $workMode
				jobType: $jobType
				searchTerm: $searchTerm
				location: $location
				minExperience: $minExperience
				minSalary: $minSalary
				maxSalary: $maxSalary
				proximityKm: $proximityKm
			)
	}
`;

const ClusterJobsListInternalFragment = graphql`
	fragment ClusterJobsListInternalFragment on Query
	@refetchable(queryName: "ClusterJobsListPaginationQuery")
	@argumentDefinitions(
		cursor: { type: "ID" }
		count: { type: "Int", defaultValue: 20 }
		bounds: { type: "BoundingBoxInput!" }
		workMode: { type: "[JobWorkModeFilter!]!" }
		jobType: { type: "[JobTypeFilter!]!" }
		searchTerm: { type: "String" }
		location: { type: "String" }
		minExperience: { type: "Int" }
		minSalary: { type: "Int" }
		maxSalary: { type: "Int" }
		proximityKm: { type: "Float" }
	) {
		jobs(
			after: $cursor
			first: $count
			bounds: $bounds
			workMode: $workMode
			jobType: $jobType
			searchTerm: $searchTerm
			location: $location
			minExperience: $minExperience
			minSalary: $minSalary
			maxSalary: $maxSalary
			proximityKm: $proximityKm
		)
			@connection(
				key: "ClusterJobsListFragment_jobs"
				filters: ["bounds", "workMode", "jobType", "searchTerm", "location", "minExperience", "minSalary", "maxSalary", "proximityKm"]
			) {
			edges {
				node {
					id
					...CompactJobCard_job
				}
			}
			pageInfo {
				hasNextPage
			}
			totalCount
		}
	}
`;

interface ViewportJobsListProps {
	bounds: {
		swLat: number;
		swLng: number;
		neLat: number;
		neLng: number;
	};
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
	onJobSelect?: (jobId: string) => void;
	className?: string;
}

/**
 * ViewportJobsList Component
 *
 * Displays a list of jobs from the current map viewport using GraphQL.
 * Shows all jobs visible in the current map bounds regardless of zoom level.
 */
function ViewportJobsContent({ bounds, filters, onJobSelect, className = '' }: ViewportJobsListProps) {
	const queryData = useLazyLoadQuery<ClusterJobsListQuery>(ClusterJobsListQueryNode, {
		bounds,
		workMode: (filters.workMode.length > 0 ? filters.workMode : ['OFFICE', 'REMOTE', 'HYBRID']) as readonly JobWorkModeFilter[],
		jobType: (filters.jobType.length > 0
			? filters.jobType
			: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'LOCUM']) as readonly JobTypeFilter[],
		searchTerm: filters.searchTerm || undefined,
		location: filters.location || undefined,
		minExperience: filters.minExperience || undefined,
		minSalary: filters.minSalary || undefined,
		maxSalary: filters.maxSalary || undefined,
		proximityKm: filters.proximityKm || undefined
	});

	const { data, loadNext, isLoadingNext } = usePaginationFragment<ClusterJobsListPaginationQuery, ClusterJobsListInternalFragment$key>(
		ClusterJobsListInternalFragment,
		queryData
	);

	const observerRef = useRef<HTMLDivElement | null>(null);

	// Set up IntersectionObserver for infinite scroll
	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			entries => {
				const entry = entries[0];
				if (entry.isIntersecting && data.jobs.pageInfo.hasNextPage && !isLoadingNext) {
					loadNext(20);
				}
			},
			{ threshold: 1.0 }
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.jobs.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	const allJobEdges = data.jobs.edges;
	const hasMoreJobs = data.jobs.pageInfo.hasNextPage;

	return (
		<div className={`w-full ${className}`}>
			{/* Jobs List */}
			<div className='w-full space-y-6'>
				{allJobEdges.map(edge => (
					<CompactJobCard
						key={edge.node.id}
						job={edge.node}
						onClick={() => onJobSelect?.(edge.node.id)}
						className='w-full border border-divider hover:border-primary-200'
					/>
				))}

				{/* Infinite scroll trigger */}
				{hasMoreJobs && <div ref={observerRef} className='h-10' />}

				{/* Loading State */}
				{isLoadingNext && <ClusterJobsListSkeleton count={3} />}

				{/* No Jobs Found */}
				{allJobEdges.length === 0 && !isLoadingNext && (
					<div className='text-center py-8 w-full'>
						<p className='text-sm text-foreground-500'>No jobs found in this area</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default function ViewportJobsList({ bounds, filters, onJobSelect, className = '' }: ViewportJobsListProps) {
	const [retryKey, setRetryKey] = useState(0);

	// Always render the viewport jobs (no zoom or cluster restrictions)
	return (
		<div className={`w-full ${className}`}>
			<ViewportJobsErrorBoundary onRetry={() => setRetryKey(prev => prev + 1)}>
				<Suspense fallback={<ClusterJobsListSkeleton />}>
					<ViewportJobsContent key={retryKey} bounds={bounds} filters={filters} onJobSelect={onJobSelect} className='w-full' />
				</Suspense>
			</ViewportJobsErrorBoundary>
		</div>
	);
}
