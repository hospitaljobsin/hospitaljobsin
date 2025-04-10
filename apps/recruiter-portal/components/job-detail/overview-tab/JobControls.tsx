import type { JobControlsFragment$key } from "@/__generated__/JobControlsFragment.graphql";
import type { JobControlsPublishMutation as JobControlsPublishMutationType } from "@/__generated__/JobControlsPublishMutation.graphql";
import { Button, addToast, useDisclosure } from "@heroui/react";
import { BookPlus, BookX } from "lucide-react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import UnpublishJobModal from "./UnpublishJobModal";

const JobControlsFragment = graphql`
  fragment JobControlsFragment on Job {
    id
    isActive
    ...UnpublishJobModalFragment
  }
`;

const JobControlsPublishMutation = graphql`
mutation JobControlsPublishMutation($jobId: ID!) {
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

    ... on JobApplicationFormNotFoundError {
        __typename
    }
  }
}
`;

type Props = {
	job: JobControlsFragment$key;
};

export default function JobControls({ job }: Props) {
	const data = useFragment(JobControlsFragment, job);
	const [commitPublishMutation, isPublishMutationInFlight] =
		useMutation<JobControlsPublishMutationType>(JobControlsPublishMutation);

	const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

	async function handlePublishJob() {
		commitPublishMutation({
			variables: {
				jobId: data.id,
			},
			onCompleted(response) {
				if (response.publishJob.__typename === "Job") {
					// Handle success
				} else if (
					response.publishJob.__typename === "JobNotFoundError" ||
					response.publishJob.__typename === "JobApplicationFormNotFoundError"
				) {
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

	function handleUnpublishJob() {
		onOpen();
	}

	return (
		<>
			{data.isActive ? (
				<Button
					onPress={handleUnpublishJob}
					startContent={<BookX size={20} />}
					className="w-full sm:w-auto"
				>
					Unpublish job
				</Button>
			) : (
				<Button
					color="primary"
					onPress={handlePublishJob}
					isLoading={isPublishMutationInFlight}
					startContent={<BookPlus size={20} />}
				>
					Publish job
				</Button>
			)}
			<UnpublishJobModal
				isOpen={isOpen}
				onClose={onClose}
				onOpenChange={onOpenChange}
				job={data}
			/>
		</>
	);
}
