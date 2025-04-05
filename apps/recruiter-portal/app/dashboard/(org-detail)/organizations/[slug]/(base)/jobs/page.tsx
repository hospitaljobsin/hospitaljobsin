import type { pageOrganizationJobsMetadataFragment$key } from "@/__generated__/pageOrganizationJobsMetadataFragment.graphql";
import type OrganizationJobsViewQueryNode from "@/__generated__/pageOrganizationJobsViewQuery.graphql";
import type { pageOrganizationJobsViewQuery } from "@/__generated__/pageOrganizationJobsViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import OrganizationJobsViewClientComponent from "./OrganizationJobsViewClientComponent";

export const PageOrganizationJobsViewQuery = graphql`
  query pageOrganizationJobsViewQuery($slug: String!, $searchTerm: String) {	
    ...pageOrganizationJobsMetadataFragment @arguments(slug: $slug)
    ...OrganizationJobsViewClientComponentFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

const PageOrganizationJobsMetadataFragment = graphql`
 fragment pageOrganizationJobsMetadataFragment on Query @inline @argumentDefinitions(
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
		typeof OrganizationJobsViewQueryNode,
		pageOrganizationJobsViewQuery
	>(PageOrganizationJobsViewQuery, {
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

	const data = readInlineData<pageOrganizationJobsMetadataFragment$key>(
		PageOrganizationJobsMetadataFragment,
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
		title: `Jobs - ${data.organization.name}`,
		openGraph: {
			images: [data.organization.logoUrl || "/default-image.img"],
		},
	};
}

export default async function OrganizationJobsPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadOrganization(slug);

	const data = readInlineData<pageOrganizationJobsMetadataFragment$key>(
		PageOrganizationJobsMetadataFragment,
		preloadedQuery.data,
	);

	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isMember
	) {
		notFound();
	}

	return (
		<OrganizationJobsViewClientComponent preloadedQuery={preloadedQuery} />
	);
}
