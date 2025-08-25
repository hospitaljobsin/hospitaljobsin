import type { JobListFragment$key } from "@/__generated__/JobListFragment.graphql";
import type { JobListInternalFragment$key } from "@/__generated__/JobListInternalFragment.graphql";
import type { LandingClientComponentQuery } from "@/__generated__/LandingClientComponentQuery.graphql";
import { Card, CardBody } from "@heroui/react";
import { Search } from "lucide-react";
import { useTransition } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { WindowVirtualizer } from "virtua";
import Job from "./Job";
import JobListSkeleton from "./JobListSkeleton";

const JobListFragment = graphql`
fragment JobListFragment on Query {
	...JobListInternalFragment
	viewer {
		...JobControlsAuthFragment
	}
}
`;

const JobListInternalFragment = graphql`
  fragment JobListInternalFragment on Query
  @refetchable(queryName: "JobListRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  ){
    trendingJobs(after: $cursor, first: $count)
      @connection(key: "JobListFragment_trendingJobs") {
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
	rootQuery: JobListFragment$key;
};

export default function JobList({ rootQuery }: Props) {
	const [_isPending, startTransition] = useTransition();
	const root = useFragment(JobListFragment, rootQuery);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		LandingClientComponentQuery,
		JobListInternalFragment$key
	>(JobListInternalFragment, root);

	const handleScrollEnd = () => {
		if (data.trendingJobs.pageInfo.hasNextPage && !isLoadingNext) {
			startTransition(() => {
				loadNext(25);
			});
		}
	};

	if (
		data.trendingJobs.edges.length === 0 &&
		!data.trendingJobs.pageInfo.hasNextPage
	) {
		return (
			<Card
				className="p-6"
				fullWidth
				shadow="none"
				style={{ background: "transparent" }}
			>
				<CardBody className="flex flex-col gap-6 w-full items-center">
					<div className="flex flex-col items-center">
						{/* Simple monochrome icon (e.g., magnifying glass) */}
						<Search className="text-foreground-800" size={35} />
					</div>
					<div className="w-full flex flex-col gap-2 items-center">
						<h2 className="font-medium text-muted-foreground text-base">
							No Trending Jobs found
						</h2>
						<p className="text-muted-foreground text-sm text-center max-w-xs">
							Please try again later.
						</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<div
			style={{
				height: "100%",
				width: "100%",
				scrollbarWidth: "none",
				msOverflowStyle: "none",
				scrollBehavior: "smooth",
			}}
		>
			<WindowVirtualizer onScrollEnd={handleScrollEnd}>
				{data.trendingJobs.edges.map((jobEdge) => (
					<div key={jobEdge.node.id} className="pb-4 sm:pb-6">
						<Job job={jobEdge.node} authQueryRef={root.viewer} />
					</div>
				))}
				{data.trendingJobs.pageInfo.hasNextPage && (
					<div className="pb-4 sm:pb-6">
						<JobListSkeleton />
					</div>
				)}
			</WindowVirtualizer>
		</div>
	);
}
