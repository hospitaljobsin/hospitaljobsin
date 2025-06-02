"use client";
import type { DashboardViewFragment$key } from "@/__generated__/DashboardViewFragment.graphql";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import OrganizationJobsController from "./OrganizationJobsController";
import OrganizationJobsList from "./OrganizationJobsList";

const DashboardViewFragment = graphql`
 fragment DashboardViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  searchTerm: { type: "String", defaultValue: null }
    ) {
        ...OrganizationJobsListFragment @arguments(slug: $slug, searchTerm: $searchTerm)
		...OrganizationJobsControllerFragment @arguments(slug: $slug)
  }
`;

export default function DashboardView(props: {
	rootQuery: DashboardViewFragment$key;
}) {
	const query = useFragment(DashboardViewFragment, props.rootQuery);
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<OrganizationJobsController
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				rootQuery={query}
			/>
			<OrganizationJobsList rootQuery={query} searchTerm={searchTerm} />
		</div>
	);
}
