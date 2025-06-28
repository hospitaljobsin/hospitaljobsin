import type { OrganizationMembersControllerFragment$key } from "@/__generated__/OrganizationMembersControllerFragment.graphql";
import { Button, Input, useDisclosure } from "@heroui/react";
import { Search, UserPlus } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import InviteMemberModal from "../shared/InviteMemberModal";

interface OrganizationMembersControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
	organization: OrganizationMembersControllerFragment$key;
}

const OrganizationMembersControllerFragment = graphql`
fragment OrganizationMembersControllerFragment on Organization {
			isAdmin
            ...InviteMemberModalFragment
    }
`;

export default function OrganizationMembersController(
	props: OrganizationMembersControllerProps,
) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const data = useFragment(
		OrganizationMembersControllerFragment,
		props.organization,
	);

	const isAdmin = data.isAdmin;

	function handleOpenModal() {
		if (isAdmin) {
			onOpen();
		}
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
					placeholder="Find a member..."
					variant="bordered"
					value={props.searchTerm || ""}
					onValueChange={(value) => props.setSearchTerm(value)}
					onClear={() => props.setSearchTerm(null)}
					fullWidth
				/>
				{isAdmin && (
					<Button
						color="primary"
						startContent={<UserPlus size={20} />}
						onPress={handleOpenModal}
						className="w-full sm:w-auto flex-shrink-0"
					>
						Invite
					</Button>
				)}
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
