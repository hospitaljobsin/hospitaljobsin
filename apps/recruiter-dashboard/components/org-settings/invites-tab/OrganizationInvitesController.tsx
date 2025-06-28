import type { OrganizationInvitesControllerFragment$key } from "@/__generated__/OrganizationInvitesControllerFragment.graphql";
import { Button, Input, useDisclosure } from "@heroui/react";
import { Search, UserPlus } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import InviteMemberModal from "../shared/InviteMemberModal";

interface OrganizationInvitesControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
	organization: OrganizationInvitesControllerFragment$key;
}

const OrganizationInvitesControllerFragment = graphql`
fragment OrganizationInvitesControllerFragment on Organization {
            ...InviteMemberModalFragment
        }
`;

export default function OrganizationInvitesController(
	props: OrganizationInvitesControllerProps,
) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const data = useFragment(
		OrganizationInvitesControllerFragment,
		props.organization,
	);

	function handleOpenModal() {
		onOpen();
	}

	return (
		<>
			<div className="w-full flex flex-col sm:flex-row items-center gap-8">
				<Input
					classNames={{
						inputWrapper: "bg-background shadow-none",
					}}
					startContent={
						<Search
							size={20}
							className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-4"
						/>
					}
					isClearable
					placeholder="Find an invite..."
					variant="bordered"
					value={props.searchTerm || ""}
					onValueChange={(value) => props.setSearchTerm(value)}
					onClear={() => props.setSearchTerm(null)}
					fullWidth
				/>
				<Button
					color="primary"
					startContent={<UserPlus size={20} />}
					onPress={handleOpenModal}
					className="w-full sm:w-auto flex-shrink-0"
				>
					Invite
				</Button>
			</div>
			<InviteMemberModal
				onOpenChange={onOpenChange}
				isOpen={isOpen}
				organization={data}
				onClose={onClose}
			/>
		</>
	);
}
