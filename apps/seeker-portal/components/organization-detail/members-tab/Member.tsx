import { Card, CardBody } from "@heroui/react";
import Image from "next/image";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { MemberFragment$key } from "@/__generated__/MemberFragment.graphql";

export const MemberFragment = graphql`
  fragment MemberFragment on OrganizationMemberEdge {
	role
    node {
        fullName
        avatarUrl
    }
  }
`;

export const MemberAuthFragment = graphql`
  fragment MemberAuthFragment on ViewerPayload {
	__typename
  }
`;

type Props = {
	member: MemberFragment$key;
};

export default function Member({ member }: Props) {
	const data = useFragment(MemberFragment, member);

	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardBody className="flex items-center gap-6 w-full flex-row">
				<Image
					src={data.node.avatarUrl}
					alt={data.node.fullName}
					width={50}
					height={50}
					className="rounded-full"
				/>
				<h2>{data.node.fullName}</h2>
			</CardBody>
		</Card>
	);
}
