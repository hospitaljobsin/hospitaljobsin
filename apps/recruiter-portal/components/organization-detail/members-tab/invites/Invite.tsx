import type { InviteFragment$key } from "@/__generated__/InviteFragment.graphql";
import type { InviteOrganizationFragment$key } from "@/__generated__/InviteOrganizationFragment.graphql";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Tooltip,
	useDisclosure,
} from "@heroui/react";
import { Trash } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import DeleteInviteModal from "./DeleteInviteModal";

export const InviteFragment = graphql`
  fragment InviteFragment on OrganizationInvite {
	email
	status
	expiresAt
	...DeleteInviteModalFragment
  }
`;

const InviteOrganizationFragment = graphql`
  fragment InviteOrganizationFragment on Organization {
	...DeleteInviteModalOrganizationFragment
  }
`;

type Props = {
	invite: InviteFragment$key;
	invitesConnectionId: string;
	organization: InviteOrganizationFragment$key;
};

export default function Invite({
	invite,
	invitesConnectionId,
	organization,
}: Props) {
	const data = useFragment(InviteFragment, invite);
	const organizationData = useFragment(
		InviteOrganizationFragment,
		organization,
	);
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const renderStatus = (status: string) => {
		switch (status) {
			case "PENDING":
				return "Pending";
			case "ACCEPTED":
				return "Accepted";
			case "DECLINED":
				return "Declined";
			default:
				return "Unknown";
		}
	};

	async function handleInviteDelete() {
		onOpen();
	}

	return (
		<>
			<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
				<CardHeader className="w-full flex justify-between gap-6">
					<div className="flex gap-4 items-center">
						<h2 className="text-lg">{data.email}</h2>
					</div>
					<div className="flex items-center">
						<Tooltip content="Delete Invite">
							<Button
								isIconOnly
								variant="light"
								color="danger"
								onPress={handleInviteDelete}
							>
								<Trash size={20} />
							</Button>
						</Tooltip>
					</div>
				</CardHeader>
				<CardBody className="flex items-start gap-6 w-full flex-col">
					<div className="w-full flex gap-6 items-center">
						<p>Status: {renderStatus(data.status)}</p>
						<p>Expires at {new Date(data.expiresAt).toLocaleDateString()}</p>
					</div>
				</CardBody>
			</Card>
			<DeleteInviteModal
				isOpen={isOpen}
				onClose={onClose}
				onOpenChange={onOpenChange}
				invite={data}
				organization={organizationData}
				invitesConnectionId={invitesConnectionId}
			/>
		</>
	);
}
