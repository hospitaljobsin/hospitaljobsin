import type { DeleteJobModalFragment$key } from "@/__generated__/DeleteJobModalFragment.graphql";
import type { DeleteJobModalMutation } from "@/__generated__/DeleteJobModalMutation.graphql";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next/app";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	addToast,
} from "@heroui/react";
import { useParams } from "next/navigation";
import { useFragment, useMutation } from "react-relay";
import { ConnectionHandler, graphql } from "relay-runtime";

const DeleteJobModalFragment = graphql`
    fragment DeleteJobModalFragment on Job {
        id
        organization @required(action: THROW) {
            id
        }
    }
    `;

const DeleteJobMutation = graphql`
  mutation DeleteJobModalMutation($jobId: ID!) {
    deleteJob(jobId: $jobId) {
        __typename
        ... on Job {
            id
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

export default function DeleteJobModal({
	isOpen,
	onOpenChange,
	onClose,
	job,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	job: DeleteJobModalFragment$key;
}) {
	const router = useRouter();
	const params = useParams<{ slug: string }>();
	const data = useFragment(DeleteJobModalFragment, job);
	const [commitMutation, isMutationInFlight] =
		useMutation<DeleteJobModalMutation>(DeleteJobMutation);

	function handleDeleteJob() {
		commitMutation({
			variables: {
				jobId: data.id,
			},
			updater(store) {
				const connectionID = ConnectionHandler.getConnectionID(
					data.organization.id,
					"OrganizationJobsListInternalFragment_jobs",
					[],
				);
				const connectionRecord = store.get(connectionID);

				const jobRecord = store.get(data.id);

				// Only update if the connection exists
				if (connectionRecord && jobRecord) {
					ConnectionHandler.deleteNode(connectionRecord, jobRecord.getDataID());
				}
			},

			onCompleted(response) {
				onClose();
				if (response.deleteJob.__typename === "Job") {
					// handle success
					router.push(links.organizationDetailJobs(params.slug));
				} else if (response.deleteJob.__typename === "JobNotFoundError") {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.deleteJob.__typename === "OrganizationAuthorizationError"
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
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
				<ModalContent className="flex flex-col w-full p-4 sm:p-6">
					<ModalHeader>
						<h2 className="text-lg font-medium">Delete Job</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to delete this job? This action cannot be
							undone.
						</p>
					</ModalBody>
					<ModalFooter className="w-full">
						<Button variant="light" onPress={onClose}>
							Cancel
						</Button>
						<Button
							color="danger"
							isLoading={isMutationInFlight}
							onPress={handleDeleteJob}
						>
							Delete Job
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
