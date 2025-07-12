import type { MemberAccountFragment$key } from "@/__generated__/MemberAccountFragment.graphql";
import type { MemberFragment$key } from "@/__generated__/MemberFragment.graphql";
import type { MemberOrganizationFragment$key } from "@/__generated__/MemberOrganizationFragment.graphql";
import { dateFormat } from "@/lib/intl";
import { Card, CardBody, Chip } from "@heroui/react";
import Image from "next/image";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import MemberControls from "./member-controls/MemberControls";

const MemberFragment = graphql`
  fragment MemberFragment on OrganizationMemberEdge {
	role
	createdAt
    node {
        fullName
        avatarUrl
    }
	...MemberControlsFragment
  }
`;

const MemberOrganizationFragment = graphql`
  fragment MemberOrganizationFragment on Organization {
	isAdmin
	...MemberControlsOrganizationFragment
  }
`;

const MemberAccountFragment = graphql`
	fragment MemberAccountFragment on Account {
		...MemberControlsAccountFragment
	}
`;

type Props = {
	member: MemberFragment$key;
	organization: MemberOrganizationFragment$key;
	account: MemberAccountFragment$key;
	membersConnectionId: string;
};

export default function Member({
	member,
	organization,
	membersConnectionId,
	account,
}: Props) {
	const data = useFragment(MemberFragment, member);
	const organizationData = useFragment(
		MemberOrganizationFragment,
		organization,
	);
	const accountData = useFragment(MemberAccountFragment, account);

	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardBody className="flex items-center gap-6 w-full flex-row">
				<Image
					src={data.node.avatarUrl}
					alt={data.node.fullName}
					width={56}
					height={56}
					className="rounded-full aspect-square object-cover"
				/>
				<div className="w-full flex item-center justify-between gap-6">
					<div className="w-full flex flex-col gap-4">
						<div className="flex gap-4 items-baseline">
							<p className="text-medium">{data.node.fullName}</p>
							<Chip
								size="sm"
								variant="flat"
								color={data.role === "admin" ? "primary" : "default"}
							>
								{data.role}
							</Chip>
						</div>
						<p className="text-sm text-foreground-400">
							Joined on {dateFormat.format(new Date(data.createdAt))}
						</p>
					</div>
					{organizationData.isAdmin && (
						<MemberControls
							member={data}
							organization={organizationData}
							membersConnectionId={membersConnectionId}
							account={accountData}
						/>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
