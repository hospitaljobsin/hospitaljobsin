"use client";
import DashboardClientComponentQuery, {
	type DashboardClientComponentQuery as DashboardClientComponentQueryType,
} from "@/__generated__/DashboardClientComponentQuery.graphql";
import type { DashboardViewFragment$key } from "@/__generated__/DashboardViewFragment.graphql";
import { useState } from "react";
import type { PreloadedQuery } from "react-relay";
import { graphql, useFragment, usePreloadedQuery } from "react-relay";
import NotFoundView from "../NotFoundView";
import OrganizationJobsController, {
	JobSortBy,
} from "./OrganizationJobsController";
import OrganizationJobsList from "./OrganizationJobsList";

const DashboardViewFragment = graphql`
 fragment DashboardViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  searchTerm: { type: "String", defaultValue: null }
	  sortBy: { type: "JobSortBy!", defaultValue: CREATED_AT }
    ) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				name
				isMember
				...OrganizationJobsControllerFragment
				...OrganizationJobsListFragment @arguments(searchTerm: $searchTerm, sortBy: $sortBy)
			}
		}
  }
`;

export default function DashboardView(props: {
	initialQueryRef: PreloadedQuery<DashboardClientComponentQueryType>;
}) {
	const data = usePreloadedQuery(
		DashboardClientComponentQuery,
		props.initialQueryRef,
	);
	const query = useFragment<DashboardViewFragment$key>(
		DashboardViewFragment,
		data,
	);
	const [sortBy, setSortBy] = useState<JobSortBy>(
		JobSortBy.LAST_APPLICANT_APPLIED_AT,
	);
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	if (
		query.organization.__typename !== "Organization" ||
		!query.organization.isMember
	) {
		// If the user is not a member of the organization, we can redirect or show an error.
		// For now, we will just return null to avoid rendering the component.
		return <NotFoundView />;
	}

	return (
		<div className="w-full h-full flex flex-col relative">
			<div className="md:sticky md:top-0 z-10 px-6 pt-8 pb-4">
				<OrganizationJobsController
					sortBy={sortBy}
					setSortBy={setSortBy}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					organization={query.organization}
				/>
			</div>
			<div className="flex-1 md:overflow-y-auto px-6 py-8 ">
				<OrganizationJobsList
					organization={query.organization}
					searchTerm={searchTerm}
					sortBy={sortBy}
				/>
			</div>
		</div>
	);
}
