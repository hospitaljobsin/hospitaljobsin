/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { ApplicantsTabFragment$key } from "@/__generated__/ApplicantsTabFragment.graphql";
import { graphql, useFragment } from "react-relay";

const ApplicantsTabFragment = graphql`
 fragment ApplicantsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
		job(slug: $slug) {
			__typename
			... on Job {
				id
			}     
    	}
  }
`;

export default function ApplicantsTab(props: {
	rootQuery: ApplicantsTabFragment$key;
}) {
	const query = useFragment(ApplicantsTabFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			applicants tab
		</div>
	);
}
