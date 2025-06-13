"use client";
import type { DashboardViewFragment$key } from "@/__generated__/DashboardViewFragment.graphql";
import type { pageDashboardViewQuery as PageDashboardViewQueryType } from "@/__generated__/pageDashboardViewQuery.graphql";
import { PageDashboardViewQuery } from "@/app/(base)/(dashboard)/page";
import { useState } from "react";
import type { PreloadedQuery } from "react-relay";
import { graphql, useFragment, usePreloadedQuery } from "react-relay";
import invariant from "tiny-invariant";
import OrganizationJobsController from "./OrganizationJobsController";
import OrganizationJobsList from "./OrganizationJobsList";
// Chat/Message imports

const DashboardViewFragment = graphql`
 fragment DashboardViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  searchTerm: { type: "String", defaultValue: null }
    ) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				name
				isMember
			}
		}
        ...OrganizationJobsListFragment @arguments(slug: $slug, searchTerm: $searchTerm)
		...OrganizationJobsControllerFragment @arguments(slug: $slug)
  }
`;

export default function DashboardView(props: {
	initialQueryRef: PreloadedQuery<PageDashboardViewQueryType>;
}) {
	const data = usePreloadedQuery(PageDashboardViewQuery, props.initialQueryRef);
	const query = useFragment<DashboardViewFragment$key>(
		DashboardViewFragment,
		data,
	);
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	invariant(
		query.organization.__typename === "Organization",
		"Expected organization data",
	);

	if (!query.organization.isMember) {
		// If the user is not a member of the organization, we can redirect or show an error.
		// For now, we will just return null to avoid rendering the component.
		return null;
	}

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12 relative">
			<OrganizationJobsController
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				rootQuery={query}
			/>
			<div className="flex-1 min-h-0 w-full overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-w-2.5 scrollbar-thumb-[hsl(var(--heroui-foreground-300))] scrollbar-track-transparent">
				<OrganizationJobsList rootQuery={query} searchTerm={searchTerm} />
			</div>
		</div>
	);
}
