/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { ApplicationFormTabFragment$key } from "@/__generated__/ApplicationFormTabFragment.graphql";
import { graphql, useFragment } from "react-relay";
import ApplicationFormBuilder from "./ApplicationFormBuilder";

const ApplicationFormTabFragment = graphql`
 fragment ApplicationFormTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  jobSlug: {type: "String!"}
    ) {
        ...ApplicationFormBuilderFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

export default function ApplicationFormTab(props: {
	rootQuery: ApplicationFormTabFragment$key;
}) {
	const query = useFragment(ApplicationFormTabFragment, props.rootQuery);

	return (
		<div className="w-full h-full flex flex-col items-center gap-12">
			<ApplicationFormBuilder rootQuery={query} />
		</div>
	);
}
