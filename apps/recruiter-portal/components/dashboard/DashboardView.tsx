"use client";
import links from "@/lib/links";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay/hooks";
import { graphql } from "relay-runtime";
import invariant from 'tiny-invariant';
import { DashboardViewOrganizationsListFragment$key } from "./__generated__/DashboardViewOrganizationsListFragment.graphql";
import type { DashboardViewQuery } from "./__generated__/DashboardViewQuery.graphql";

const DashboardViewQuery = graphql`
	query DashboardViewQuery {
		viewer {
			__typename
			... on Account {
				...DashboardViewOrganizationsListFragment
			}
		}
	}`;

const OrganizationsListInternalFragment = graphql`
  fragment DashboardViewOrganizationsListFragment on Account
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "OrganizationsListPaginationQuery") {
    organizations(after: $cursor, first: $count)
      @connection(key: "OrganizationsListInternalFragment_organizations") {
      edges {
        node {
          id
		  name
		  slug
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export default function DashboardView() {
	const router = useRouter();
	const root = useLazyLoadQuery<DashboardViewQuery>(DashboardViewQuery, {});
	invariant(root.viewer.__typename === "Account", "Expected Account type");
	const {data} = usePaginationFragment<DashboardViewQuery,
	DashboardViewOrganizationsListFragment$key>(OrganizationsListInternalFragment, root.viewer);

	const selectedOrganizationSlug = data.organizations.edges.length > 0 
		? data.organizations.edges[0].node.slug 
		: null;

	useEffect(() => {
		if (selectedOrganizationSlug) {
			router.push(links.organizationDetail(selectedOrganizationSlug));
		}
	}, [selectedOrganizationSlug, router]);

	return (
		<div className="w-full h-full flex flex-col mt-4 sm:-mt-20 gap-4 sm:gap-8">
			create a new organization
		</div>
	);
}
