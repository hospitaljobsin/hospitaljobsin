import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import type { pageOrganizationInvitesMetadataFragment$key } from "@/__generated__/pageOrganizationInvitesMetadataFragment.graphql";
import type OrganizationInvitesViewQueryNode from "@/__generated__/pageOrganizationInvitesViewQuery.graphql";
import type { pageOrganizationInvitesViewQuery } from "@/__generated__/pageOrganizationInvitesViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import OrganizationInvitesViewClientComponent from "./OrganizationInvitesViewClientComponent";

export const PageOrganizationInvitesViewQuery = graphql`
  query pageOrganizationInvitesViewQuery($slug: String!, $searchTerm: String) {
    ...pageOrganizationInvitesMetadataFragment @arguments(slug: $slug)
    ...OrganizationInvitesViewClientComponentFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

const PageOrganizationInvitesMetadataFragment = graphql`
 fragment pageOrganizationInvitesMetadataFragment on Query @inline @argumentDefinitions(
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
		typeof OrganizationInvitesViewQueryNode,
		pageOrganizationInvitesViewQuery
	>(PageOrganizationInvitesViewQuery, {
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

	const data = readInlineData<pageOrganizationInvitesMetadataFragment$key>(
		PageOrganizationInvitesMetadataFragment,
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
		title: `Invites - ${data.organization.name}`,
		openGraph: {
			images: [data.organization.logoUrl || "/default-image.img"],
		},
	};
}

export default async function OrganizationInvitesPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadOrganization(slug);

	const data = readInlineData<pageOrganizationInvitesMetadataFragment$key>(
		PageOrganizationInvitesMetadataFragment,
		preloadedQuery.data,
	);

	// only admins can manage invites in the organization
	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isAdmin
	) {
		notFound();
	}

	return (
		<OrganizationInvitesViewClientComponent preloadedQuery={preloadedQuery} />
	);
}
