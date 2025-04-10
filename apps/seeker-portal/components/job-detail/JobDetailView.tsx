import type { JobDetailViewFragment$key } from "@/__generated__/JobDetailViewFragment.graphql";
import { graphql, useFragment } from "react-relay";
import JobDetails from "./JobDetails";

const JobDetailViewFragment = graphql`
 fragment JobDetailViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
		...JobDetailsFragment @arguments(slug: $slug)
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
