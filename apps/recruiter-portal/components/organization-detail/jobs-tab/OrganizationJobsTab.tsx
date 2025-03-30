/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { OrganizationJobsTabFragment$key } from "@/__generated__/OrganizationJobsTabFragment.graphql";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import OrganizationJobsController from "./OrganizationJobsController";
import OrganizationJobsTable from "./OrganizationJobsTable";

const OrganizationJobsTabFragment = graphql`
 fragment OrganizationJobsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  searchTerm: { type: "String", defaultValue: null }
    ) {
        ...OrganizationJobsTableFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

export default function OrganizationJobsTab(props: {
	rootQuery: OrganizationJobsTabFragment$key;
}) {
	const query = useFragment(OrganizationJobsTabFragment, props.rootQuery);
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<OrganizationJobsController
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			<OrganizationJobsTable rootQuery={query} searchTerm={searchTerm} />
		</div>
	);
}
