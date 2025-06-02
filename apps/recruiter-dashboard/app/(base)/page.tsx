import type { pageDashboardMetadataFragment$key } from "@/__generated__/pageDashboardMetadataFragment.graphql";
import type DashboardViewQueryNode from "@/__generated__/pageDashboardViewQuery.graphql";
import type { pageDashboardViewQuery } from "@/__generated__/pageDashboardViewQuery.graphql";
import { ORG_SUBDOMAIN_HEADER_NAME } from "@/lib/constants";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import invariant from "tiny-invariant";
import DashboardClientComponent from "./DashboardClientComponent";

export const PageDashboardViewQuery = graphql`
  query pageDashboardViewQuery($slug: String!, $searchTerm: String) {
	...pageDashboardMetadataFragment @arguments(slug: $slug)
	...DashboardClientComponentFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

const PageDashboardMetadataFragment = graphql`
 fragment pageDashboardMetadataFragment on Query @inline @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
	organization(slug: $slug) {
	  __typename
	  ... on Organization {
		name
		description
		logoUrl
		isMember
	  }

	}
  }
`;

// Function to load and cache the query result
const loadOrganization = cache(async (slug: string) => {
	return await loadSerializableQuery<
		typeof DashboardViewQueryNode,
		pageDashboardViewQuery
	>(PageDashboardViewQuery, {
		slug: slug,
	});
});

export async function generateMetadata() {
	const headersList = await headers();
	const organizationSlug = headersList.get(ORG_SUBDOMAIN_HEADER_NAME);
	invariant(organizationSlug, "Organization slug is required in headers");
	const preloadedQuery = await loadOrganization(organizationSlug);

	const data = readInlineData<pageDashboardMetadataFragment$key>(
		PageDashboardMetadataFragment,
		preloadedQuery.data,
	);

	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isMember
	) {
		// If the organization is not found or the user is not a member, return a not found metadata
		return {
			title: "Organization Not found",
			description: "The organization you are looking for does not exist",
			openGraph: {
				images: ["/default-image.img"],
			},
		};
	}

	return {
		title: data.organization.name,
		description: data.organization.description,
		openGraph: {
			images: [data.organization.logoUrl],
		},
	};
}

export default async function DashboardPage() {
	const headersList = await headers();
	const organizationSlug = headersList.get(ORG_SUBDOMAIN_HEADER_NAME);

	invariant(organizationSlug, "Organization slug is required in headers");

	const preloadedQuery = await loadOrganization(organizationSlug);

	const data = readInlineData<pageDashboardMetadataFragment$key>(
		PageDashboardMetadataFragment,
		preloadedQuery.data,
	);

	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isMember
	) {
		notFound();
	}

	return <DashboardClientComponent preloadedQuery={preloadedQuery} />;
}
