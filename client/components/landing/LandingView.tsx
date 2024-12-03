import { useState } from "react";
import { graphql, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { useDebounce } from "use-debounce";
import { LandingViewQuery as LandingViewQueryType } from "./__generated__/LandingViewQuery.graphql";
import JobList from "./JobList";
import JobListController from "./JobListController";

const LandingViewQuery = graphql`
  query LandingViewQuery {
    ...JobListFragment
  }
`;

export default function LandingView(props: {
  queryRef: PreloadedQuery<LandingViewQueryType>;
}) {
  const data = usePreloadedQuery(LandingViewQuery, props.queryRef);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  return (
    <div className="py-8 w-full h-full max-w-7xl mx-auto flex flex-col gap-8">
      <JobListController
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <JobList searchTerm={debouncedSearchTerm} rootQuery={data} />
    </div>
  );
}
