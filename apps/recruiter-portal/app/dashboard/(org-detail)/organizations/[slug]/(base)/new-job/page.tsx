import type { pageOrganizationNewJobMetadataFragment$key } from "@/__generated__/pageOrganizationNewJobMetadataFragment.graphql";
import type OrganizationNewJobViewQueryNode from "@/__generated__/pageOrganizationNewJobViewQuery.graphql";
import type { pageOrganizationNewJobViewQuery } from "@/__generated__/pageOrganizationNewJobViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import OrganizationNewJobViewClientComponent from "./OrganizationNewJobViewClientComponent";

export const PageOrganizationNewJobViewQuery = graphql`
  query pageOrganizationNewJobViewQuery($slug: String!) {	
	...pageOrganizationNewJobMetadataFragment @arguments(slug: $slug)
	...OrganizationNewJobViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageOrganizationNewJobMetadataFragment = graphql`
 fragment pageOrganizationNewJobMetadataFragment on Query @inline @argumentDefinitions(
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
		typeof OrganizationNewJobViewQueryNode,
		pageOrganizationNewJobViewQuery
	>(PageOrganizationNewJobViewQuery, {
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

	const data = readInlineData<pageOrganizationNewJobMetadataFragment$key>(
		PageOrganizationNewJobMetadataFragment,
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
		title: `NewJob - ${data.organization.name}`,
		openGraph: {
			images: [data.organization.logoUrl || "/default-image.img"],
		},
	};
}

export default async function NewJobPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadOrganization(slug);

	const data = readInlineData<pageOrganizationNewJobMetadataFragment$key>(
		PageOrganizationNewJobMetadataFragment,
		preloadedQuery.data,
	);

	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isMember
	) {
		notFound();
	}

	return (
		<div className="py-8 w-full h-full flex flex-col gap-8">
			<OrganizationNewJobViewClientComponent preloadedQuery={preloadedQuery} />
		</div>
	);
}
