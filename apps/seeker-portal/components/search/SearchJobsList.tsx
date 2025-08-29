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
import { Search } from "lucide-react";
import { useEffect, useRef, useTransition } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { WindowVirtualizer } from "virtua";

const SearchJobsListFragment = graphql`
fragment SearchJobsListFragment on Query @argumentDefinitions(
	proximityKm: { type: "Float", defaultValue: null }
	searchTerm: { type: "String", defaultValue: null }
	coordinates: { type: "CoordinatesInput", defaultValue: null }
	minExperience: { type: "Int", defaultValue: null }
	minSalary: { type: "Int", defaultValue: null }
	maxSalary: { type: "Int", defaultValue: null }
	workMode: { type: "[JobWorkModeFilter!]!" }
	jobType: { type: "[JobTypeFilter!]!" }
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
	minSalary: { type: "Int", defaultValue: null }
	maxSalary: { type: "Int", defaultValue: null }
	workMode: { type: "[JobWorkModeFilter!]!" }
	jobType: { type: "[JobTypeFilter!]!" }
  ){
    jobs(after: $cursor, first: $count, searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm, minExperience: $minExperience, minSalary: $minSalary, maxSalary: $maxSalary, workMode: $workMode, jobType: $jobType)
      @connection(key: "JobListFragment_jobs", filters: ["searchTerm", "coordinates", "proximityKm", "minExperience", "minExperience", "minSalary", "maxSalary", "workMode", "jobType"]) {
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
	coordinates: CoordinatesInput | null;
	proximityKm: number | null;
	minExperience?: number | null;
	minSalary?: number | null;
	maxSalary?: number | null;
	workMode?: string[];
	jobType?: string[];
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

	const hasMountedRef = useRef(false);

	console.log("search term", searchTerm);

	// Flatten all job edges for virtualizer
	const allJobEdges = data.jobs.edges;
	const hasNextPage = data.jobs.pageInfo.hasNextPage;

	// Handle infinite scroll when reaching the end
	const handleScrollEnd = () => {
		if (hasNextPage && !isLoadingNext) {
			loadNext(25);
		}
	};

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
					workMode: (workMode || []) as readonly JobWorkModeFilter[],
					jobType: (jobType || []) as readonly JobTypeFilter[],
				};
				if (typeof minExperience !== "undefined")
					refetchVars.minExperience = minExperience;
				if (typeof minSalary !== "undefined") refetchVars.minSalary = minSalary;
				if (typeof maxSalary !== "undefined") refetchVars.maxSalary = maxSalary;
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
			className="h-full w-full scroll-smooth overflow-none"
			style={{
				scrollbarWidth: "none",
			}}
		>
			<h2 className="text-lg text-foreground-600 mb-6 sm:mb-8">
				<span className="font-medium">{data.jobs.totalCount}</span> healthcare
				jobs found
			</h2>
			<WindowVirtualizer onScrollEnd={handleScrollEnd}>
				{allJobEdges.map((jobEdge, index) => (
					<div key={jobEdge.node.id} className="pb-4 sm:pb-6">
						<Job job={jobEdge.node} authQueryRef={root.viewer} />
					</div>
				))}
				{hasNextPage && (
					<div className="pb-4 sm:pb-6">
						<JobListSkeleton />
					</div>
				)}
			</WindowVirtualizer>
		</div>
	);
}
