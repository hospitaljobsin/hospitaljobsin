import type { MemberControlsFragment$key } from "@/__generated__/MemberControlsFragment.graphql";
import type { MemberControlsOrganizationFragment$key } from "@/__generated__/MemberControlsOrganizationFragment.graphql";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	useDisclosure,
} from "@heroui/react";
import { EllipsisVertical, ShieldUser, UserMinus, UserX } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import DemoteMemberModal from "./DemoteMemberModal";
import PromoteMemberModal from "./PromoteMemberModal";
import RemoveMemberModal from "./RemoveMemberModal";

const MemberControlsFragment = graphql`
    fragment MemberControlsFragment on OrganizationMemberEdge {
        role
        node {
            fullName
        }
        ...RemoveMemberModalFragment
        ...DemoteMemberModalFragment
        ...PromoteMemberModalFragment
    }
`;

const MemberControlsOrganizationFragment = graphql`
    fragment MemberControlsOrganizationFragment on Organization {
        ...RemoveMemberModalOrganizationFragment
        ...DemoteMemberModalOrganizationFragment
        ...PromoteMemberModalOrganizationFragment
		adminCount
    }
    `;

export default function MemberControls({
	member,
	organization,
	membersConnectionId,
}: {
	member: MemberControlsFragment$key;
	organization: MemberControlsOrganizationFragment$key;
	membersConnectionId: string;
}) {
	const data = useFragment(MemberControlsFragment, member);
	const organizationData = useFragment(
		MemberControlsOrganizationFragment,
		organization,
	);
	const {
		isOpen: isRemoveMemberModalOpen,
		onOpen: onRemoveMemberModalOpen,
		onClose: onRemoveMemberModalClose,
		onOpenChange: onRemoveMemberModalOpenChange,
	} = useDisclosure();
	const {
		isOpen: isPromoteMemberModalOpen,
		onOpen: onPromoteMemberModalOpen,
		onClose: onPromoteMemberModalClose,
		onOpenChange: onPromoteMemberModalOpenChange,
	} = useDisclosure();
	const {
		isOpen: isDemoteMemberModalOpen,
		onOpen: onDemoteMemberModalOpen,
		onClose: onDemoteMemberModalClose,
		onOpenChange: onDemoteMemberModalOpenChange,
	} = useDisclosure();

	return (
		<>
			<Dropdown placement="bottom-start">
				<DropdownTrigger>
					<Button variant="light" isIconOnly>
						<EllipsisVertical size={20} />
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					aria-label="Member Actions"
					disabledKeys={
						data.role === "admin"
							? organizationData.adminCount <= 1
								? ["remove", "promote", "demote"]
								: ["remove", "promote"]
							: ["demote"]
					}
				>
					<DropdownItem
						startContent={<UserMinus size={20} />}
						key="demote"
						onPress={onDemoteMemberModalOpen}
					>
						Demote member
					</DropdownItem>
					<DropdownItem
						startContent={<ShieldUser size={20} />}
						key="promote"
						onPress={onPromoteMemberModalOpen}
					>
						Promote member
					</DropdownItem>
					<DropdownItem
						startContent={<UserX size={20} />}
						key="remove"
						onPress={onRemoveMemberModalOpen}
					>
						Remove member
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<RemoveMemberModal
				isOpen={isRemoveMemberModalOpen}
				onOpenChange={onRemoveMemberModalOpenChange}
				onClose={onRemoveMemberModalClose}
				membersConnectionId={membersConnectionId}
				member={data}
				organization={organizationData}
			/>
			<DemoteMemberModal
				isOpen={isDemoteMemberModalOpen}
				onOpenChange={onDemoteMemberModalOpenChange}
				onClose={onDemoteMemberModalClose}
				member={data}
				organization={organizationData}
			/>
			<PromoteMemberModal
				isOpen={isPromoteMemberModalOpen}
				onOpenChange={onPromoteMemberModalOpenChange}
				onClose={onPromoteMemberModalClose}
				member={data}
				organization={organizationData}
			/>
		</>
	);
}
