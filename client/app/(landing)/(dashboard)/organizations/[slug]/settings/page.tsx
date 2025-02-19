import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import OrganizationSettingsViewClientComponent from "./OrganizationSettingsViewClientComponent";
import type { pageOrganizationSettingsMetadataFragment$key } from "./__generated__/pageOrganizationSettingsMetadataFragment.graphql";
import type OrganizationSettingsViewQueryNode from "./__generated__/pageOrganizationSettingsViewQuery.graphql";
import type { pageOrganizationSettingsViewQuery } from "./__generated__/pageOrganizationSettingsViewQuery.graphql";

export const PageOrganizationSettingsViewQuery = graphql`
  query pageOrganizationSettingsViewQuery($slug: String!) {	
	...pageOrganizationSettingsMetadataFragment @arguments(slug: $slug)
	...OrganizationSettingsViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageOrganizationSettingsMetadataFragment = graphql`
 fragment pageOrganizationSettingsMetadataFragment on Query @inline @argumentDefinitions(
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
		isAdmin
	  }
	 
	}
  }
`;

// Function to load and cache the query result
const loadOrganization = cache(async (slug: string) => {
	return await loadSerializableQuery<
		typeof OrganizationSettingsViewQueryNode,
		pageOrganizationSettingsViewQuery
	>(PageOrganizationSettingsViewQuery, {
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

	const data = readInlineData<pageOrganizationSettingsMetadataFragment$key>(
		PageOrganizationSettingsMetadataFragment,
		preloadedQuery.data,
	);

	// only organization admins can access this page
	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isAdmin
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

export default async function OrganizationSettingsPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadOrganization(slug);

	const data = readInlineData<pageOrganizationSettingsMetadataFragment$key>(
		PageOrganizationSettingsMetadataFragment,
		preloadedQuery.data,
	);

	// only organization admins can access this page
	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isAdmin
	) {
		notFound();
	}

	return (
		<OrganizationSettingsViewClientComponent preloadedQuery={preloadedQuery} />
	);
}
