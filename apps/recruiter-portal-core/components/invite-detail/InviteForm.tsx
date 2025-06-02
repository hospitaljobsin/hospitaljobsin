import type { InviteFormAcceptMutation as InviteFormAcceptMutationType } from "@/__generated__/InviteFormAcceptMutation.graphql";
import type { InviteFormDeclineMutation as InviteFormDeclineMutationType } from "@/__generated__/InviteFormDeclineMutation.graphql";
import type { InviteFormFragment$key } from "@/__generated__/InviteFormFragment.graphql";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Button, Card, CardBody, CardHeader, addToast } from "@heroui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { graphql, useFragment, useMutation } from "react-relay";
import invariant from "tiny-invariant";

const InviteFormFragment = graphql`
  fragment InviteFormFragment on Query @argumentDefinitions(
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
          avatarUrl
        }
        organization {
            name
            logoUrl
			slug
        }
      }

    }
  }
`;

const InviteFormAcceptMutation = graphql`
  mutation InviteFormAcceptMutation($inviteToken: String!) {
	acceptOrganizationInvite(inviteToken: $inviteToken) {
		__typename
		... on OrganizationInviteEdge {
			__typename

		}
		... on OrganizationInviteNotFoundError {
			__typename
		}
	}
  }
`;

const InviteFormDeclineMutation = graphql`
  mutation InviteFormDeclineMutation($inviteToken: String!) {
	declineOrganizationInvite(inviteToken: $inviteToken) {
		__typename
		... on OrganizationInviteEdge {
			__typename

		}
		... on OrganizationInviteNotFoundError {
			__typename
		}
	}
  }
`;

export default function InviteForm({
	rootQuery,
}: {
	rootQuery: InviteFormFragment$key;
}) {
	const router = useRouter();
	const token = useParams<{ token: string }>().token;
	const data = useFragment(InviteFormFragment, rootQuery);
	invariant(
		data.organizationInvite.__typename === "OrganizationInvite",
		"Expected 'OrganizationInvite' node type",
	);

	const organizationSlug = data.organizationInvite.organization.slug;

	const [commitAcceptMuatation, isAcceptMutationInFlight] =
		useMutation<InviteFormAcceptMutationType>(InviteFormAcceptMutation);
	const [commitDeclineMuatation, isDeclineMutationInFlight] =
		useMutation<InviteFormDeclineMutationType>(InviteFormDeclineMutation);

	async function handleAccept() {
		commitAcceptMuatation({
			variables: {
				inviteToken: token,
			},
			onCompleted(response) {
				if (
					response.acceptOrganizationInvite.__typename ===
					"OrganizationInviteEdge"
				) {
					// Handle successful acceptance of the invite
					router.replace(links.organizationDetail(organizationSlug));
				} else if (
					response.acceptOrganizationInvite.__typename ===
					"OrganizationInviteNotFoundError"
				) {
					// Handle invite not found error
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				}
			},
		});
	}

	async function handleDecline() {
		commitDeclineMuatation({
			variables: {
				inviteToken: token,
			},
			onCompleted(response) {
				if (
					response.declineOrganizationInvite.__typename ===
					"OrganizationInviteEdge"
				) {
					// Handle successful declination of the invite
					router.replace(links.selectOrganization);
				} else if (
					response.declineOrganizationInvite.__typename ===
					"OrganizationInviteNotFoundError"
				) {
					// Handle invite not found error
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				}
			},
		});
	}

	return (
		<div className="w-full flex flex-col gap-6">
			<Card fullWidth className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<div className="flex w-full justify-between gap-12 sm:gap-6 sm:items-center flex-col sm:flex-row items-start">
						<div className="flex flex-col gap-10 items-center justify-center w-full">
							<div className="flex w-full gap-10 items-center justify-center">
								<Image
									src={data.organizationInvite.createdBy.avatarUrl}
									alt={data.organizationInvite.createdBy.fullName}
									width={75}
									height={75}
									className="rounded-md transition-transform transform hover:scale-105"
								/>
								<Image
									src={data.organizationInvite.organization.logoUrl}
									alt={data.organizationInvite.organization.name}
									width={75}
									height={75}
									className="rounded-md transition-transform transform hover:scale-105"
								/>
							</div>
							<div className="flex flex-col gap-3 items-center justify-center w-full">
								<h4 className="text-lg w-full text-center text-gray-700">
									<span className="font-medium">
										{data.organizationInvite.createdBy.fullName}
									</span>{" "}
									invited you to join
								</h4>
								<h2 className="text-2xl font-medium w-full text-center text-gray-900">
									{data.organizationInvite.organization.name}
								</h2>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col sm:flex-row gap-10 w-full max-w-xl mx-auto">
					<Button
						color="primary"
						fullWidth
						onPress={handleAccept}
						isLoading={isAcceptMutationInFlight}
						isDisabled={isDeclineMutationInFlight}
					>
						Accept
					</Button>
					<Button
						fullWidth
						onPress={handleDecline}
						isLoading={isDeclineMutationInFlight}
						isDisabled={isAcceptMutationInFlight}
					>
						Decline
					</Button>
				</CardBody>
			</Card>
		</div>
	);
}
