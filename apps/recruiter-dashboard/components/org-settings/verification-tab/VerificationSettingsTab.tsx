/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import OrganizationVerificationSettingsClientComponentQuery, {
	type OrganizationVerificationSettingsClientComponentQuery as OrganizationVerificationSettingsClientComponentQueryType,
} from "@/__generated__/OrganizationVerificationSettingsClientComponentQuery.graphql";
import type { VerificationSettingsTabFragment$key } from "@/__generated__/VerificationSettingsTabFragment.graphql";
import NotFoundView from "@/components/NotFoundView";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import invariant from "tiny-invariant";
import AlreadyVerified from "./AlreadyVerified";
import PendingVerificationView from "./PendingVerificationView";
import RejectedVerificationView from "./RejectedVerificationView";
import RequestVerificationForm from "./RequestVerificationForm";

const VerificationSettingsTabFragment = graphql`
 fragment VerificationSettingsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        organization(slug: $slug) {
            __typename
            ... on Organization {
				isAdmin
                verificationStatus {
					__typename
					... on Verified {
						verifiedAt
					}
					... on Rejected {
						rejectedAt
					}
					... on Pending {
						requestedAt
					}
					... on NotRequested {
						message
					}
				}
                ...AlreadyVerifiedFragment
				...RequestVerificationFormFragment
                ...PendingVerificationViewFragment
                ...RejectedVerificationViewFragment
            }
        }

		viewer {
			__typename
			... on Account {
				sudoModeExpiresAt
				...DeleteOrganizationModalAccountFragment
			}
		}

  }
`;

export default function VerificationSettingsTab({
	initialQueryRef,
}: {
	initialQueryRef: PreloadedQuery<OrganizationVerificationSettingsClientComponentQueryType>;
}) {
	const rootQuery = usePreloadedQuery(
		OrganizationVerificationSettingsClientComponentQuery,
		initialQueryRef,
	);
	const data = useFragment<VerificationSettingsTabFragment$key>(
		VerificationSettingsTabFragment,
		rootQuery,
	);

	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isAdmin
	) {
		return <NotFoundView />;
	}

	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	if (data.organization.verificationStatus.__typename === "Verified") {
		return <AlreadyVerified organization={data.organization} />;
	}
	if (data.organization.verificationStatus.__typename === "Pending") {
		return <PendingVerificationView organization={data.organization} />;
	}
	if (data.organization.verificationStatus.__typename === "Rejected") {
		return <RejectedVerificationView organization={data.organization} />;
	}
	return <RequestVerificationForm organization={data.organization} />;
}
