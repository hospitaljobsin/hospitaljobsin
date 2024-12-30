/* eslint-disable relay/must-colocate-fragment-spreads */
import type { PreloadedQuery } from "react-relay";
import { graphql, usePreloadedQuery } from "react-relay";
import JobDetails from "./JobDetails";
import type { JobDetailViewQuery as JobDetailViewQueryType } from "./__generated__/JobDetailViewQuery.graphql";

const JobDetailViewQuery = graphql`
  query JobDetailViewQuery($slug: String!) {	
	...pageJobDetailFragment @arguments(slug: $slug)
    ...JobDetailsQuery @arguments(slug: $slug)
  }
`;

export default function JobDetailView(props: {
	queryRef: PreloadedQuery<JobDetailViewQueryType>;
}) {
	const data = usePreloadedQuery(JobDetailViewQuery, props.queryRef);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-6">
			<JobDetails rootQuery={data} />
		</div>
	);
}
