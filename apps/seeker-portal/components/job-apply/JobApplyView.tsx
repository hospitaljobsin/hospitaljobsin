import type { JobApplyViewFragment$key } from "@/__generated__/JobApplyViewFragment.graphql";
import { graphql, useFragment } from "react-relay";
import JobApplyForm from "./JobApplyForm";

const JobApplyViewFragment = graphql`
 fragment JobApplyViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...JobApplyFormFragment @arguments(slug: $slug)
  }
`;

export default function JobApplyView(props: {
	rootQuery: JobApplyViewFragment$key;
}) {
	const query = useFragment(JobApplyViewFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-6">
			<JobApplyForm rootQuery={query} />
		</div>
	);
}
