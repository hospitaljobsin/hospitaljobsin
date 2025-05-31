import {
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { graphql, useFragment, useMutation } from "react-relay";
import type { UnpublishJobModalFragment$key } from "@/__generated__/UnpublishJobModalFragment.graphql";
import type { UnpublishJobModalMutation as UnpublishJobModalMutationType } from "@/__generated__/UnpublishJobModalMutation.graphql";

type Props = {
	isOpen: boolean;
	onOpenChange: (arg: boolean) => void;
	onClose: () => void;
	job: UnpublishJobModalFragment$key;
};

const UnpublishJobModalMutation = graphql`
mutation UnpublishJobModalMutation($jobId: ID!) {
  unpublishJob(jobId: $jobId) {
    __typename
    ... on Job {
        __typename
        ...JobControlsFragment
    }

    ... on JobNotFoundError {
        __typename
    }

    ... on OrganizationAuthorizationError {
        __typename
    }

    ... on JobNotPublishedError {
        __typename
    }
  }
}
`;

const UnpublishJobModalFragment = graphql`
fragment UnpublishJobModalFragment on Job {
    id
}`;

export default function UnpublishJobModal({
	isOpen,
	onOpenChange,
	onClose,
	job,
}: Props) {
	const data = useFragment(UnpublishJobModalFragment, job);
	const [commitUnpublishMutation, isUnpublishMutationInFlight] =
		useMutation<UnpublishJobModalMutationType>(UnpublishJobModalMutation);

	async function handleUnpublishJob() {
		commitUnpublishMutation({
			variables: {
				jobId: data.id,
			},
			onCompleted(response) {
				onClose();
				if (response.unpublishJob.__typename === "Job") {
					// Handle success
				} else if (
					response.unpublishJob.__typename === "JobNotFoundError" ||
					response.unpublishJob.__typename === "JobNotPublishedError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.unpublishJob.__typename === "OrganizationAuthorizationError"
				) {
					addToast({
						description: "You are not authorized to perform this action.",
						color: "danger",
					});
				}
			},
		});
	}

	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			placement="center"
			hideCloseButton
			size="xl"
		>
			<ModalContent className="p-4 sm:p-6">
				<ModalHeader className="flex flex-col gap-1">Unpublish job</ModalHeader>
				<ModalBody>
					Are you sure you want to unpublish this job? It won't be visible to
					job seekers on the platform with immediate effect.
				</ModalBody>
				<ModalFooter className="flex justify-end gap-4">
					<Button variant="light" onPress={onClose}>
						Cancel
					</Button>
					<Button
						color="danger"
						onPress={handleUnpublishJob}
						isDisabled={isUnpublishMutationInFlight}
					>
						Unpublish job
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
