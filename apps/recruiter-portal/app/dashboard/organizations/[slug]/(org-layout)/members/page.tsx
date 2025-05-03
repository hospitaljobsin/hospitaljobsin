import type { pageOrganizationMembersMetadataFragment$key } from "@/__generated__/pageOrganizationMembersMetadataFragment.graphql";
import type OrganizationMembersViewQueryNode from "@/__generated__/pageOrganizationMembersViewQuery.graphql";
import type { pageOrganizationMembersViewQuery } from "@/__generated__/pageOrganizationMembersViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import OrganizationMembersViewClientComponent from "./OrganizationMembersViewClientComponent";

export const PageOrganizationMembersViewQuery = graphql`
  query pageOrganizationMembersViewQuery($slug: String!, $searchTerm: String) {	
	...pageOrganizationMembersMetadataFragment @arguments(slug: $slug)
    ...OrganizationMembersViewClientComponentFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

export const PageOrganizationMembersMetadataFragment = graphql`
 fragment pageOrganizationMembersMetadataFragment on Query @inline @argumentDefinitions(
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
		isAdmin
	  }
	 
	}
  }
`;

// Function to load and cache the query result
export const loadOrganization = cache(async (slug: string) => {
	return await loadSerializableQuery<
		typeof OrganizationMembersViewQueryNode,
		pageOrganizationMembersViewQuery
	>(PageOrganizationMembersViewQuery, {
		slug: slug,
	});
});

// TODO: we cannot be generating metadata here because outer layouts are client components
// we need to try and make sure that the outer layouts are a server component
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;
	const preloadedQuery = await loadOrganization(slug);

	const data = readInlineData<pageOrganizationMembersMetadataFragment$key>(
		PageOrganizationMembersMetadataFragment,
		preloadedQuery.data,
	);

	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isMember
	) {
		return {
			title: "Organization Not found",
			description: "The organization you are looking for does not exist",
			openGraph: {
				images: ["/default-image.img"],
			},
		};
	}

	return {
		title: `Members - ${data.organization.name}`,
		openGraph: {
			images: [data.organization.logoUrl || "/default-image.img"],
		},
	};
}

export default async function OrganizationMembersPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadOrganization(slug);

	const data = readInlineData<pageOrganizationMembersMetadataFragment$key>(
		PageOrganizationMembersMetadataFragment,
		preloadedQuery.data,
	);

	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isMember
	) {
		notFound();
	}

	return (
		<OrganizationMembersViewClientComponent preloadedQuery={preloadedQuery} />
	);
}
