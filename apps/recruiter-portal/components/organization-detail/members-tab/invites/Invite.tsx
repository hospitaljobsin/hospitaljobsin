import type { InviteFragment$key } from "@/__generated__/InviteFragment.graphql";
import type { InviteOrganizationFragment$key } from "@/__generated__/InviteOrganizationFragment.graphql";
import { getRelativeTimeString } from "@/lib/intl";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Tooltip,
	useDisclosure,
} from "@heroui/react";
import { Info, Mail, Trash } from "lucide-react";
import Image from "next/image";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import DeleteInviteModal from "./DeleteInviteModal";

export const InviteFragment = graphql`
  fragment InviteFragment on OrganizationInvite {
	email
	status
	expiresAt
	createdBy {
		fullName
		avatarUrl
	}
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

	// TODO: show status as expired if invite expires

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
						<Mail size={24} />
						<h2 className="text-lg">{data.email}</h2>
					</div>
					<div className="flex items-center">
						<Tooltip content="Delete Invite">
							<Button isIconOnly variant="light" onPress={handleInviteDelete}>
								<Trash size={20} />
							</Button>
						</Tooltip>
					</div>
				</CardHeader>
				<CardBody className="w-full flex gap-8 items-start sm:items-center flex-col sm:flex-row">
					<div className="flex items-center gap-2 text-foreground-400">
						<Info size={20} />
						<p> {renderStatus(data.status)}</p>
					</div>
					{data.expiresAt && (
						<p className="text-foreground-400">
							Expires {getRelativeTimeString(data.expiresAt)}
						</p>
					)}

					<div className="flex gap-4 items-center">
						<p className="text-foreground-400">Invited by</p>
						<Tooltip
							content={
								<div className="flex flex-col gap-2">
									<h3>{data.createdBy.fullName}</h3>
								</div>
							}
						>
							<Image
								src={data.createdBy.avatarUrl}
								alt={data.createdBy.fullName}
								width={25}
								height={25}
								className="rounded-full"
							/>
						</Tooltip>
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
