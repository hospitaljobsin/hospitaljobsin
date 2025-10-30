import React, { Suspense, useEffect, useState } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
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
const ViewportJobsQuery = graphql`
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
		$first: Int
		$after: ID
	) {
		jobs(
			bounds: $bounds
			workMode: $workMode
			jobType: $jobType
			searchTerm: $searchTerm
			location: $location
			minExperience: $minExperience
			minSalary: $minSalary
			maxSalary: $maxSalary
			proximityKm: $proximityKm
			first: $first
			after: $after
		) {
			edges {
				node {
					...CompactJobCard_job
				}
				cursor
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
			totalCount
		}
	}
`;

// Use any for now until Relay generates proper types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ViewportJob = any;

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
// Separate component for when we have data
function ViewportJobsContent({ bounds, filters, onJobSelect, className = '' }: ViewportJobsListProps) {
	const [cursor, setCursor] = useState<string | null>(null);
	const [allJobs, setAllJobs] = useState<ViewportJob[]>([]);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = useLazyLoadQuery(ViewportJobsQuery, {
		bounds,
		workMode: filters.workMode.length > 0 ? (filters.workMode as readonly string[]) : ['OFFICE', 'REMOTE', 'HYBRID'], // Default to all work modes if none specified
		jobType:
			filters.jobType.length > 0 ? (filters.jobType as readonly string[]) : ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'LOCUM'], // Default to all job types if none specified
		searchTerm: filters.searchTerm || undefined,
		location: filters.location || undefined,
		minExperience: filters.minExperience || undefined,
		minSalary: filters.minSalary || undefined,
		maxSalary: filters.maxSalary || undefined,
		proximityKm: filters.proximityKm || undefined,
		first: 20,
		after: cursor
	}) as any;

	// Reset accumulated jobs when bounds or filters change
	useEffect(() => {
		setAllJobs([]);
		setCursor(null);
		setIsLoadingMore(false);
	}, [
		bounds.swLat,
		bounds.swLng,
		bounds.neLat,
		bounds.neLng,
		filters.searchTerm,
		filters.location,
		filters.minExperience,
		filters.minSalary,
		filters.maxSalary,
		filters.proximityKm,
		filters.workMode,
		filters.jobType
	]);

	// Accumulate jobs when new data arrives
	useEffect(() => {
		if (data?.jobs?.edges) {
			if (cursor === null) {
				// Initial load - replace all jobs
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				setAllJobs(data.jobs.edges.map((edge: any) => edge.node));
			} else {
				// Load more - append to existing jobs
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				setAllJobs(prev => [...prev, ...data.jobs.edges.map((edge: any) => edge.node)]);
			}
			setIsLoadingMore(false);
		}
	}, [data, cursor]);

	function loadMoreJobs() {
		if (!data?.jobs?.pageInfo?.hasNextPage || isLoadingMore) return;

		setIsLoadingMore(true);
		setCursor(data.jobs.pageInfo.endCursor);
	}

	const hasMoreJobs = data?.jobs?.pageInfo?.hasNextPage;
	const totalCount = data?.jobs?.totalCount || 0;

	return (
		<div className={`w-full ${className}`}>
			{/* Jobs List */}
			<div className='w-full space-y-6'>
				{allJobs.map(job => (
					<CompactJobCard
						key={job.id}
						job={job}
						onClick={() => onJobSelect?.(job.id)}
						className='w-full border border-divider hover:border-primary-200'
					/>
				))}

				{/* Loading State */}
				{isLoadingMore && <ClusterJobsListSkeleton count={3} />}

				{/* Load More Button */}
				{hasMoreJobs && !isLoadingMore && allJobs.length > 0 && (
					<button
						type='button'
						onClick={loadMoreJobs}
						disabled={isLoadingMore}
						className='w-full py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50'
					>
						Load more jobs ({totalCount} total)
					</button>
				)}

				{/* No More Results */}
				{!hasMoreJobs && allJobs.length > 0 && <p className='text-center text-xs text-foreground-500 py-2'>All jobs in this area loaded</p>}

				{/* No Jobs Found */}
				{allJobs.length === 0 && !isLoadingMore && (
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
