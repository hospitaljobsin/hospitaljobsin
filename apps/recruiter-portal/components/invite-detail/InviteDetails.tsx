import type { InviteDetailsFragment$key } from "@/__generated__/InviteDetailsFragment.graphql";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";

const InviteDetailsFragment = graphql`
  fragment InviteDetailsFragment on Query @argumentDefinitions(
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
        }
      }
     
    }
  }
`;

export default function InviteDetails({
	rootQuery,
}: { rootQuery: InviteDetailsFragment$key }) {
	const data = useFragment(InviteDetailsFragment, rootQuery);
	invariant(
		data.organizationInvite.__typename === "OrganizationInvite",
		"Expected 'OrganizationInvite' node type",
	);

	return (
		<div className="w-full flex flex-col gap-6">
			<Card fullWidth className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<div className="flex w-full justify-between gap-12 sm:gap-6 sm:items-center flex-col sm:flex-row items-start">
						<div className="flex gap-6 items-start">
							<Image
								src={data.organizationInvite.createdBy.avatarUrl}
								alt={data.organizationInvite.createdBy.fullName}
								width={75}
								height={75}
							/>
							<div className="flex flex-col gap-3 items-start">
								<h4 className="text-xl font-medium">
									{data.organizationInvite.createdBy.fullName} invited you to{" "}
									{data.organizationInvite.organization.name}
								</h4>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-6 w-full"></CardBody>
			</Card>
		</div>
	);
}
