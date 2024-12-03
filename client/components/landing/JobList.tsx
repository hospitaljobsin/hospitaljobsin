import { usePaginationFragment } from "react-relay";
import Job from "./Job";

import { Button } from "@nextui-org/react";
import { useEffect, useTransition } from "react";
import { graphql } from "relay-runtime";
import { JobListFragment$key } from "./__generated__/JobListFragment.graphql";

const JobListFragment = graphql`
  fragment JobListFragment on Query
  @refetchable(queryName: "JobListPaginationQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
    searchTerm: { type: "String", defaultValue: null }
    count: { type: "Int", defaultValue: 5 }
  ) {
    jobs(after: $cursor, first: $count, searchTerm: $searchTerm)
      @connection(key: "JobListFragment_jobs", filters: ["searchTerm"]) {
      __id
      edges {
        node {
          id
          ...JobFragment
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
  searchTerm: string | null;
};

export default function JobList({ rootQuery, searchTerm }: Props) {
  const [isPending, startTransition] = useTransition();
  const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    JobListFragment,
    rootQuery
  );

  useEffect(() => {
    startTransition(() => {
      refetch(
        { first: 5, searchTerm: searchTerm },
        {
          fetchPolicy: "store-or-network",
        }
      );
    });
  }, [searchTerm]);

  function loadMore() {
    loadNext(5);
  }

  if (data.jobs.edges.length === 0 && !data.jobs.pageInfo.hasNextPage) {
    return (
      <div className="flex grow flex-col gap-4 px-4 items-center h-full">
        <p className="font-medium text-muted-foreground">
          Hmm, there are no jobs yet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 pb-6">
      {data.jobs.edges.map((jobEdge) => {
        return (
          <Job
            job={jobEdge.node}
            connectionId={data.jobs.__id}
            key={jobEdge.node.id}
          />
        );
      })}
      {data.jobs.pageInfo.hasNextPage && (
        <Button
          fullWidth
          variant={"bordered"}
          onClick={loadMore}
          disabled={isLoadingNext || isPending}
        >
          load more
        </Button>
      )}
    </div>
  );
}
