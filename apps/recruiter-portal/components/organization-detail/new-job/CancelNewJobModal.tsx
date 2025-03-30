import type { CancelNewJobModalOrganizationFragment$key } from "@/__generated__/CancelNewJobModalOrganizationFragment.graphql";
import links from "@/lib/links";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { graphql, useFragment } from "react-relay";

export const CancelNewJobModalOrganizationFragment = graphql`
    fragment CancelNewJobModalOrganizationFragment on Organization {
        __typename
        slug
}`;
type Props = {
	isOpen: boolean;
	onOpenChange: (arg: boolean) => void;
	organization: CancelNewJobModalOrganizationFragment$key;
};

export default function CancelNewJobModal({
	isOpen,
	onOpenChange,
	organization,
}: Props) {
	const router = useRouter();

	const data = useFragment(CancelNewJobModalOrganizationFragment, organization);

	function handleDiscardChanges() {
		router.push(links.organizationDetailJobs(data.slug));
	}

	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			placement="center"
			hideCloseButton
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Discard changes?
						</ModalHeader>
						<ModalBody>
							<p>
								You have unsaved changes. Are you sure you want to discard them?
							</p>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" onPress={onClose}>
								Keep editing
							</Button>
							<Button color="danger" onPress={handleDiscardChanges}>
								Close and discard
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
