import type { InviteFragment$key } from "@/__generated__/InviteFragment.graphql";
import type { InviteOrganizationFragment$key } from "@/__generated__/InviteOrganizationFragment.graphql";
import { getRelativeTimeString } from "@/lib/intl";
import { Button, Card, CardBody, Tooltip, useDisclosure } from "@heroui/react";
import { Info, Mail, Timer, Trash } from "lucide-react";
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
	createdAt
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
				<CardBody className="flex flex-col lg:flex-row items-center justify-between gap-4 duration-200 w-full">
					<div className="flex items-center gap-6 w-full">
						<div className="p-3 bg-foreground-100 rounded-full">
							<Mail size={20} className="text-foreground-500" />
						</div>
						<div className="flex flex-col gap-4">
							<h2 className="text-lg font-medium">{data.email}</h2>
							<p className="text-sm text-foreground-400 flex items-center gap-2">
								Invited{" "}
								<span className="italic">
									{getRelativeTimeString(data.createdAt)}
								</span>{" "}
								by{" "}
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
										width={18}
										height={18}
										className="rounded-full mr-1"
									/>
								</Tooltip>
							</p>
						</div>
					</div>

					<div className="flex items-center gap-4 md:gap-6 w-full justify-end">
						<div className="flex items-center gap-2 text-foreground-400">
							<Info size={16} />
							<p className="text-sm">{renderStatus(data.status)}</p>
						</div>
						{data.expiresAt && (
							<div className="flex items-center gap-2 text-foreground-400">
								<Timer size={16} />
								<p className="text-sm text-foreground-400">
									Expires {getRelativeTimeString(data.expiresAt)}
								</p>
							</div>
						)}
						<Tooltip content="Delete Invite">
							<Button isIconOnly variant="light" onPress={handleInviteDelete}>
								<Trash size={16} />
							</Button>
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
