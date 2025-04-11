/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { JobEditTabFragment$key } from "@/__generated__/JobEditTabFragment.graphql";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import JobEditForm from "./JobEditForm";

const JobEditTabFragment = graphql`
 fragment JobEditTabFragment on Query @argumentDefinitions(
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

export default function JobEditTab(props: {
	rootQuery: JobEditTabFragment$key;
}) {
	const query = useFragment(JobEditTabFragment, props.rootQuery);
	invariant(query.job.__typename === "Job", "Expected 'Job' node type");

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<JobEditForm rootQuery={query.job} />
		</div>
	);
}
