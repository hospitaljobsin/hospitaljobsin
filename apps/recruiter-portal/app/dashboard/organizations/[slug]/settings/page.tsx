import type { pageGeneralSettingsMetadataFragment$key } from "@/__generated__/pageGeneralSettingsMetadataFragment.graphql";
import type GeneralSettingsViewQueryNode from "@/__generated__/pageGeneralSettingsViewQuery.graphql";
import type { pageGeneralSettingsViewQuery } from "@/__generated__/pageGeneralSettingsViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import GeneralSettingsViewClientComponent from "./GeneralSettingsViewClientComponent";

export const PageGeneralSettingsViewQuery = graphql`
  query pageGeneralSettingsViewQuery($slug: String!) {	
    ...GeneralSettingsViewClientComponentFragment @arguments(slug: $slug)
	...pageGeneralSettingsMetadataFragment @arguments(slug: $slug)
  }
`;

const PageGeneralSettingsMetadataFragment = graphql`
 fragment pageGeneralSettingsMetadataFragment on Query @inline @argumentDefinitions(
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
		typeof GeneralSettingsViewQueryNode,
		pageGeneralSettingsViewQuery
	>(PageGeneralSettingsViewQuery, {
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

	const data = readInlineData<pageGeneralSettingsMetadataFragment$key>(
		PageGeneralSettingsMetadataFragment,
		preloadedQuery.data,
	);

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

export default async function GeneralSettingsPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadOrganization(slug);

	const data = readInlineData<pageGeneralSettingsMetadataFragment$key>(
		PageGeneralSettingsMetadataFragment,
		preloadedQuery.data,
	);

	// only admins can view and change organization settings
	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isAdmin
	) {
		notFound();
	}

	return <GeneralSettingsViewClientComponent preloadedQuery={preloadedQuery} />;
}
