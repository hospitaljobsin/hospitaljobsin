import JobDetails from "@/components/job-detail/JobDetails";
import { Suspense } from "react";
import { graphql, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { JobDetailViewQuery as JobDetailViewQueryType } from "./__generated__/JobDetailViewQuery.graphql";

const JobDetailViewQuery = graphql`
  query JobDetailViewQuery($jobId: ID!) {
    node(id: $jobId) {
      __typename
      ... on Job {
        ...JobDetailsFragment
      }
    }
  }
`;

export default function JobDetailView(props: {
  queryRef: PreloadedQuery<JobDetailViewQueryType>;
}) {
  const data = usePreloadedQuery(JobDetailViewQuery, props.queryRef);

  if (!data.node || data.node.__typename !== "Job") {
    return null;
  }

  return (
    <Suspense fallback="Loading (client side)...">
      <div className="flex flex-col w-full h-full items-center gap-6 py-8">
        <JobDetails job={data.node} />
      </div>
    </Suspense>
  );
}
