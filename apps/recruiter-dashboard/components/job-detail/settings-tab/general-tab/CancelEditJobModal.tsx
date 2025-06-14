import type { CancelEditJobModalJobFragment$key } from "@/__generated__/CancelEditJobModalJobFragment.graphql";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next/app";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { graphql, useFragment } from "react-relay";

export const CancelEditJobModalJobFragment = graphql`
    fragment CancelEditJobModalJobFragment on Job {
        __typename
        slug
        organization @required(action: THROW) {
            slug
        }
}`;
type Props = {
	isOpen: boolean;
	onOpenChange: (arg: boolean) => void;
	job: CancelEditJobModalJobFragment$key;
};

export default function CancelEditJobModal({
	isOpen,
	onOpenChange,
	job,
}: Props) {
	const router = useRouter();

	const data = useFragment(CancelEditJobModalJobFragment, job);

	function handleDiscardChanges() {
		router.push(links.organizationJobDetail(data.slug));
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
