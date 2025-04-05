import type { pageInviteDetailMetadataFragment$key } from "@/__generated__/pageInviteDetailMetadataFragment.graphql";
import type InviteDetailViewQueryNode from "@/__generated__/pageInviteDetailViewQuery.graphql";
import type { pageInviteDetailViewQuery } from "@/__generated__/pageInviteDetailViewQuery.graphql";
import links from "@/lib/links";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import InviteDetailViewClientComponent from "./InviteDetailViewClientComponent";

export const PageInviteDetailViewQuery = graphql`
  query pageInviteDetailViewQuery($inviteToken: String!) {	
	...pageInviteDetailMetadataFragment @arguments(inviteToken: $inviteToken)
	...InviteDetailViewClientComponentFragment @arguments(inviteToken: $inviteToken)
  }
`;

const PageInviteDetailMetadataFragment = graphql`
 fragment pageInviteDetailMetadataFragment on Query @inline @argumentDefinitions(
	  inviteToken: {
		type: "String!",
	  }
	) {
	organizationInvite(inviteToken: $inviteToken) {
	  __typename
	  ... on OrganizationInvite {
		email
		createdBy {
			fullName
		}
		organization {
		  name
		  logoUrl
		  isMember
		  slug
		}
	  }
	 
	}
  }
`;

// Function to load and cache the query result
const loadOrganization = cache(async (inviteToken: string) => {
	return await loadSerializableQuery<
		typeof InviteDetailViewQueryNode,
		pageInviteDetailViewQuery
	>(PageInviteDetailViewQuery, {
		inviteToken: inviteToken,
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const inviteToken = (await params).token;
	const preloadedQuery = await loadOrganization(inviteToken);

	const data = readInlineData<pageInviteDetailMetadataFragment$key>(
		PageInviteDetailMetadataFragment,
		preloadedQuery.data,
	);

	// only members can view the organization
	if (data.organizationInvite.__typename !== "OrganizationInvite") {
		return {
			title: "Organization Invite Not found",
			description: "The invite you are looking for does not exist",
			openGraph: {
				images: ["/default-image.img"],
			},
		};
	}

	return {
		title: `${data.organizationInvite.organization.name} Invite`,
		description: `You have been invited to join ${data.organizationInvite.organization.name} by ${data.organizationInvite.createdBy.fullName}.`,
		openGraph: {
			images: [
				data.organizationInvite.organization.logoUrl || "/default-image.img",
			],
		},
	};
}

export default async function InviteDetailPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const inviteToken = (await params).token;

	const preloadedQuery = await loadOrganization(inviteToken);

	const data = readInlineData<pageInviteDetailMetadataFragment$key>(
		PageInviteDetailMetadataFragment,
		preloadedQuery.data,
	);

	if (data.organizationInvite.__typename !== "OrganizationInvite") {
		notFound();
	}

	// redirect if the user is already a member of the organization
	if (data.organizationInvite.organization.isMember) {
		redirect(
			links.organizationDetail(data.organizationInvite.organization.slug),
		);
	}

	return <InviteDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}
