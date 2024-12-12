import { graphql, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { JobDetailViewQuery as JobDetailViewQueryType } from "./__generated__/JobDetailViewQuery.graphql";
import JobDetails from "./JobDetails";

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
    <div className="py-8 w-full h-full max-w-5xl mx-auto flex flex-col items-center gap-6">
      <JobDetails job={data.node} />
    </div>
  );
}
