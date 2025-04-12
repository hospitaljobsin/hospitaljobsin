/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { JobSettingsGeneralTabFragment$key } from "@/__generated__/JobSettingsGeneralTabFragment.graphql";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import JobEditForm from "./JobEditForm";

const JobSettingsGeneralTabFragment = graphql`
 fragment JobSettingsGeneralTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        job(slug: $slug) {
            __typename
            ... on Job {
                ...JobEditFormFragment
            }
        }
  }
`;

export default function JobSettingsGeneralTab(props: {
	rootQuery: JobSettingsGeneralTabFragment$key;
}) {
	const query = useFragment(JobSettingsGeneralTabFragment, props.rootQuery);
	invariant(query.job.__typename === "Job", "Expected 'Job' node type");

	return (
		<div className="w-full h-full flex flex-col items-center gap-12">
			<JobEditForm rootQuery={query.job} />
		</div>
	);
}
