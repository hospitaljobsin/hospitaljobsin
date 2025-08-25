import type { SearchClientComponentQuery as SearchClientComponentQueryType } from "@/__generated__/SearchClientComponentQuery.graphql";
import type { SearchJobsListFragment$key } from "@/__generated__/SearchJobsListFragment.graphql";
import type { SearchJobsListInternalFragment$key } from "@/__generated__/SearchJobsListInternalFragment.graphql";
import type {
	CoordinatesInput,
	JobTypeFilter,
	JobWorkModeFilter,
	SearchJobsListRefetchQuery$variables,
} from "@/__generated__/SearchJobsListRefetchQuery.graphql";
import Job from "@/components/landing/Job";
import JobListSkeleton from "@/components/landing/JobListSkeleton";
import { Card, CardBody } from "@heroui/react";
import type { VirtualizerOptions } from "@tanstack/react-virtual";
import { elementScroll, useVirtualizer } from "@tanstack/react-virtual";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useTransition } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";

const SearchJobsListFragment = graphql`
fragment SearchJobsListFragment on Query @argumentDefinitions(
	proximityKm: { type: "Float", defaultValue: null }
	searchTerm: { type: "String", defaultValue: null }
	coordinates: { type: "CoordinatesInput", defaultValue: null }
	minExperience: { type: "Int", defaultValue: null }
	minSalary: { type: "Int", defaultValue: null }
	maxSalary: { type: "Int", defaultValue: null }
	workMode: { type: "JobWorkModeFilter", defaultValue: ANY }
	jobType: { type: "JobTypeFilter", defaultValue: ANY }
) {
	...SearchJobsListInternalFragment @arguments(searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm, minExperience: $minExperience, minSalary: $minSalary, maxSalary: $maxSalary, workMode: $workMode, jobType: $jobType)
	viewer {
		...JobControlsAuthFragment
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
	coordinates: { type: "CoordinatesInput", defaultValue: null }
    count: { type: "Int", defaultValue: 25 }
	minExperience: { type: "Int", defaultValue: null }
	maxExperience: { type: "Int", defaultValue: null }
	minSalary: { type: "Int", defaultValue: null }
	maxSalary: { type: "Int", defaultValue: null }
	workMode: { type: "JobWorkModeFilter", defaultValue: ANY }
	jobType: { type: "JobTypeFilter", defaultValue: ANY }
  ){
    jobs(after: $cursor, first: $count, searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm, minExperience: $minExperience, maxExperience: $maxExperience, minSalary: $minSalary, maxSalary: $maxSalary, workMode: $workMode, jobType: $jobType)
      @connection(key: "JobListFragment_jobs", filters: ["searchTerm", "coordinates", "proximityKm", "minExperience", "maxExperience", "minSalary", "maxSalary", "workMode", "jobType"]) {
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
	coordinates: CoordinatesInput | null;
	proximityKm: number | null;
	minExperience?: number | null;
	minSalary?: number | null;
	maxSalary?: number | null;
	workMode?: string;
	jobType?: string;
};

export default function SearchJobsList({
	rootQuery,
	searchTerm,
	coordinates,
	proximityKm,
	minExperience,
	minSalary,
	maxSalary,
	workMode,
	jobType,
}: Props) {
	const [_isPending, startTransition] = useTransition();
	const root = useFragment(SearchJobsListFragment, rootQuery);
	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		SearchClientComponentQueryType,
		SearchJobsListInternalFragment$key
	>(SearchJobsListInternalFragment, root);

	const parentRef = useRef<HTMLDivElement>(null);
	const scrollingRef = useRef<number>();
	const hasMountedRef = useRef(false);

	console.log("search term", searchTerm);

	// Flatten all job edges for virtualizer
	const allJobEdges = data.jobs.edges;
	const hasNextPage = data.jobs.pageInfo.hasNextPage;

	// Custom smooth scroll function
	const scrollToFn: VirtualizerOptions<HTMLDivElement, Element>["scrollToFn"] =
		useCallback((offset, canSmooth, instance) => {
			const duration = 800; // Slightly faster than the example for better UX
			const start = parentRef.current?.scrollTop || 0;
			const startTime = Date.now();
			scrollingRef.current = startTime;

			const run = () => {
				if (scrollingRef.current !== startTime) return;
				const now = Date.now();
				const elapsed = now - startTime;
				const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
				const interpolated = start + (offset - start) * progress;

				if (elapsed < duration) {
					elementScroll(interpolated, canSmooth, instance);
					requestAnimationFrame(run);
				} else {
					elementScroll(interpolated, canSmooth, instance);
				}
			};

			requestAnimationFrame(run);
		}, []);

	// Easing function for smooth animation
	function easeInOutQuint(t: number) {
		return t < 0.5
			? 16 * t * t * t * t * t
			: 1 + 16 * (t - 1) * (t - 1) * (t - 1) * (t - 1) * (t - 1);
	}

	// Create virtualizer for infinite scroll
	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? allJobEdges.length + 1 : allJobEdges.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 300, // Estimate height of each job card
		overscan: 5,
		paddingStart: 16, // Add padding at the start
		paddingEnd: 16, // Add padding at the end
		gap: 20,
		scrollToFn,
	});

	// Infinite scroll effect using virtualizer
	useEffect(() => {
		const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

		if (!lastItem) {
			return;
		}

		if (
			lastItem.index >= allJobEdges.length - 1 &&
			hasNextPage &&
			!isLoadingNext
		) {
			loadNext(25);
		}
	}, [
		hasNextPage,
		loadNext,
		allJobEdges.length,
		isLoadingNext,
		rowVirtualizer,
	]);

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
					coordinates,
					proximityKm,
				};
				if (typeof minExperience !== "undefined")
					refetchVars.minExperience = minExperience;
				if (typeof minSalary !== "undefined") refetchVars.minSalary = minSalary;
				if (typeof maxSalary !== "undefined") refetchVars.maxSalary = maxSalary;
				if (typeof workMode !== "undefined")
					refetchVars.workMode = workMode as JobWorkModeFilter;
				if (typeof jobType !== "undefined")
					refetchVars.jobType = jobType as JobTypeFilter;
				refetch(refetchVars, { fetchPolicy: "network-only" });
			});
		}, 300);
		return () => clearTimeout(debounceTimeout);
	}, [
		refetch,
		searchTerm,
		coordinates,
		proximityKm,
		minExperience,
		minSalary,
		maxSalary,
		workMode,
		jobType,
	]);

	if (allJobEdges.length === 0 && !hasNextPage) {
		return (
			<Card
				className="p-6 h-full"
				fullWidth
				shadow="none"
				style={{ background: "transparent" }}
			>
				<CardBody className="flex flex-col gap-6 w-full items-center h-full justify-center">
					<div className="flex flex-col items-center">
						{/* Simple monochrome icon (e.g., magnifying glass) */}
						<Search className="text-foreground-800" size={35} />
					</div>
					<div className="w-full flex flex-col gap-2 items-center">
						<h2 className="font-medium text-muted-foreground text-base">
							No jobs found
						</h2>
						<p className="text-muted-foreground text-sm text-center max-w-xs">
							Try adjusting your search or filters to see more results.
						</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<div
			ref={parentRef}
			className="w-full h-full overflow-auto"
			style={{
				scrollbarWidth: "none", // Firefox
				msOverflowStyle: "none", // IE/Edge
				scrollBehavior: "smooth", // Enable smooth scrolling
			}}
		>
			<div
				style={{
					height: `${rowVirtualizer.getTotalSize()}px`,
					width: "100%",
					position: "relative",
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow) => {
					const isLoaderRow = virtualRow.index > allJobEdges.length - 1;
					const jobEdge = allJobEdges[virtualRow.index];

					if (isLoaderRow) {
						return (
							<div
								key={virtualRow.index}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: `${virtualRow.size}px`,
									transform: `translateY(${virtualRow.start}px)`,
								}}
								className="pb-4 sm:pb-6"
							>
								{hasNextPage ? (
									<JobListSkeleton />
								) : (
									<div className="text-center text-muted-foreground text-sm py-4">
										No more jobs to load
									</div>
								)}
							</div>
						);
					}

					return (
						<div
							key={virtualRow.index}
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: `${virtualRow.size}px`,
								transform: `translateY(${virtualRow.start}px)`,
							}}
							className="pb-4 sm:pb-6"
						>
							<Job
								job={jobEdge.node}
								key={jobEdge.node.id}
								authQueryRef={root.viewer}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
