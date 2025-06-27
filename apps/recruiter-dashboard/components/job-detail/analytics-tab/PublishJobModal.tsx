import type { PublishJobModalFragment$key } from "@/__generated__/PublishJobModalFragment.graphql";
import type { PublishJobModalMutation as PublishJobModalMutationType } from "@/__generated__/PublishJobModalMutation.graphql";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	addToast,
} from "@heroui/react";
import { graphql, useFragment, useMutation } from "react-relay";

type Props = {
	isOpen: boolean;
	onOpenChange: (arg: boolean) => void;
	onClose: () => void;
	job: PublishJobModalFragment$key;
};

const PublishJobModalMutation = graphql`
mutation PublishJobModalMutation($jobId: ID!) {
  publishJob(jobId: $jobId) {
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
  }
}
`;

const PublishJobModalFragment = graphql`
fragment PublishJobModalFragment on Job {
    id
}`;

export default function PublishJobModal({
	isOpen,
	onOpenChange,
	onClose,
	job,
}: Props) {
	const data = useFragment(PublishJobModalFragment, job);
	const [commitPublishMutation, isPublishMutationInFlight] =
		useMutation<PublishJobModalMutationType>(PublishJobModalMutation);

	async function handlePublishJob() {
		commitPublishMutation({
			variables: {
				jobId: data.id,
			},
			onCompleted(response) {
				onClose();
				if (response.publishJob.__typename === "Job") {
					// Handle success
				} else if (response.publishJob.__typename === "JobNotFoundError") {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.publishJob.__typename === "OrganizationAuthorizationError"
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
				<ModalHeader className="flex flex-col gap-1">Publish job</ModalHeader>
				<ModalBody>
					Are you sure you want to publish this job? It will make it publicly
					visible to all job seekers.
				</ModalBody>
				<ModalFooter className="flex justify-end gap-4">
					<Button variant="light" onPress={onClose}>
						Cancel
					</Button>
					<Button
						color="primary"
						onPress={handlePublishJob}
						isDisabled={isPublishMutationInFlight}
					>
						Publish job
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
