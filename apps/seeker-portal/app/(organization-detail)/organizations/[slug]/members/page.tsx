import type { pageOrganizationMembersMetadataFragment$key } from "@/__generated__/pageOrganizationMembersMetadataFragment.graphql";
import type OrganizationMembersMetadataQueryNode from "@/__generated__/pageOrganizationMembersMetadataQuery.graphql";
import type { pageOrganizationMembersMetadataQuery } from "@/__generated__/pageOrganizationMembersMetadataQuery.graphql";
import type { pageOrganizationMembersServerFragment$key } from "@/__generated__/pageOrganizationMembersServerFragment.graphql";
import type OrganizationMembersViewQueryNode from "@/__generated__/pageOrganizationMembersViewQuery.graphql";
import type { pageOrganizationMembersViewQuery } from "@/__generated__/pageOrganizationMembersViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { graphql, readInlineData } from "relay-runtime";
import OrganizationMembersViewClientComponent from "./OrganizationMembersViewClientComponent";

export const PageOrganizationMembersViewQuery = graphql`
  query pageOrganizationMembersViewQuery($slug: String!) {
	...pageOrganizationMembersServerFragment @arguments(slug: $slug)
    ...OrganizationMembersViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageOrganizationMembersServerFragment = graphql`
 fragment pageOrganizationMembersServerFragment on Query @inline @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
	organization(slug: $slug) {
	  __typename
	  ... on Organization {
		__typename
	  }

	}
  }
`;

export const PageOrganizationMembersMetadataQuery = graphql`
  query pageOrganizationMembersMetadataQuery($slug: String!) {
	...pageOrganizationMembersMetadataFragment @arguments(slug: $slug)
  }
`;

const PageOrganizationMembersMetadataFragment = graphql`
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
		bannerUrl
	  }

	}
  }
`;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;
	const preloadedQuery = await loadSerializableQuery<
		typeof OrganizationMembersMetadataQueryNode,
		pageOrganizationMembersMetadataQuery
	>(PageOrganizationMembersMetadataQuery, {
		slug: slug,
	});

	const data = readInlineData<pageOrganizationMembersMetadataFragment$key>(
		PageOrganizationMembersMetadataFragment,
		preloadedQuery.data,
	);

	if (data.organization.__typename !== "Organization") {
		return {
			title: "Organization Not found",
			description: "The organization you are looking for does not exist",
		};
	}

	return {
		title: `Members - ${data.organization.name}`,
		description: data.organization.description,
		openGraph: {
			images: [data.organization.bannerUrl],
		},
	};
}

export default async function OrganizationMembersPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadSerializableQuery<
		typeof OrganizationMembersViewQueryNode,
		pageOrganizationMembersViewQuery
	>(PageOrganizationMembersViewQuery, {
		slug: slug,
	});

	const data = readInlineData<pageOrganizationMembersServerFragment$key>(
		PageOrganizationMembersServerFragment,
		preloadedQuery.data,
	);

	if (data.organization.__typename !== "Organization") {
		notFound();
	}

	return (
		<OrganizationMembersViewClientComponent preloadedQuery={preloadedQuery} />
	);
}
