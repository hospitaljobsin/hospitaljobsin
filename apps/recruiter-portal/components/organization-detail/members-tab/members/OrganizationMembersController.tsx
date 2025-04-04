import type { OrganizationMembersControllerFragment$key } from "@/__generated__/OrganizationMembersControllerFragment.graphql";
import { Button, Input, useDisclosure } from "@heroui/react";
import { Search, UserPlus } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import InviteMemberModal from "../shared/InviteMemberModal";

interface OrganizationMembersControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
	rootQuery: OrganizationMembersControllerFragment$key;
}

const OrganizationMembersControllerFragment = graphql`
fragment OrganizationMembersControllerFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    )  {
        organization(slug: $slug) {
            __typename
            ... on Organization {
            ...InviteMemberModalFragment
            }
        }
    }
`;

export default function OrganizationMembersController(
	props: OrganizationMembersControllerProps,
) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const data = useFragment(
		OrganizationMembersControllerFragment,
		props.rootQuery,
	);

	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' node type",
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
					placeholder="Find a member..."
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
				organization={data.organization}
				onClose={onClose}
			/>
		</>
	);
}
