/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { JobEditTabFragment$key } from "@/__generated__/JobEditTabFragment.graphql";
import { graphql, useFragment } from "react-relay";
import JobEditForm from "./JobEditForm";

const JobEditTabFragment = graphql`
 fragment JobEditTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...JobEditFormFragment @arguments(slug: $slug)
  }
`;

export default function JobEditTab(props: {
	rootQuery: JobEditTabFragment$key;
}) {
	const query = useFragment(JobEditTabFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<JobEditForm rootQuery={query} />
		</div>
	);
}
