import type { JobDetailViewFragment$key } from "@/__generated__/JobDetailViewFragment.graphql";
/* eslint-disable relay/must-colocate-fragment-spreads */
import { graphql, useFragment } from "react-relay";
import JobDetails from "./JobDetails";

const JobDetailViewFragment = graphql`
 fragment JobDetailViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
		...JobDetailsQuery @arguments(slug: $slug)
  }
`;

export default function JobDetailView(props: {
	rootQuery: JobDetailViewFragment$key;
}) {
	const query = useFragment(JobDetailViewFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-6">
			<JobDetails rootQuery={query} />
		</div>
	);
}
