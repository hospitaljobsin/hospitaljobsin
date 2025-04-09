import type { pageOrganizationDetailMetadataFragment$key } from "@/__generated__/pageOrganizationDetailMetadataFragment.graphql";
import type OrganizationDetailViewQueryNode from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
import type { pageOrganizationDetailViewQuery } from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import OrganizationDetailViewClientComponent from "./OrganizationDetailViewClientComponent";

export const PageOrganizationDetailViewQuery = graphql`
  query pageOrganizationDetailViewQuery($slug: String!) {	
	...pageOrganizationDetailMetadataFragment @arguments(slug: $slug)
    ...OrganizationDetailViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageOrganizationDetailMetadataFragment = graphql`
 fragment pageOrganizationDetailMetadataFragment on Query @inline @argumentDefinitions(
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
		typeof OrganizationDetailViewQueryNode,
		pageOrganizationDetailViewQuery
	>(PageOrganizationDetailViewQuery, {
		slug: slug,
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;
	const preloadedQuery = await loadOrganization(slug);

	const data = readInlineData<pageOrganizationDetailMetadataFragment$key>(
		PageOrganizationDetailMetadataFragment,
		preloadedQuery.data,
	);

	// only members can view the organization
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
		title: data.organization.name,
		description: data.organization.description,
		openGraph: {
			images: [data.organization.logoUrl || "/default-image.img"],
		},
	};
}

export default async function OrganizationDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadOrganization(slug);

	const data = readInlineData<pageOrganizationDetailMetadataFragment$key>(
		PageOrganizationDetailMetadataFragment,
		preloadedQuery.data,
	);

	// only members can view the organization
	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isMember
	) {
		notFound();
	}

	return (
		<OrganizationDetailViewClientComponent preloadedQuery={preloadedQuery} />
	);
}
