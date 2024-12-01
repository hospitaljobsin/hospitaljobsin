import { Suspense } from "react";
import { graphql, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { LandingViewQuery as LandingViewQueryType } from "./__generated__/LandingViewQuery.graphql";
import JobList from "./JobList";

const LandingViewQuery = graphql`
  query LandingViewQuery {
    ...JobListFragment
  }
`;

export default function LandingView(props: {
  queryRef: PreloadedQuery<LandingViewQueryType>;
}) {
  const data = usePreloadedQuery(LandingViewQuery, props.queryRef);

  return (
    <Suspense fallback="Loading (client side)...">
      <JobList rootQuery={data} />
    </Suspense>
  );
}
