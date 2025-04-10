import type { JobControlsFragment$key } from "@/__generated__/JobControlsFragment.graphql";
import type { JobControlsPublishMutation as JobControlsPublishMutationType } from "@/__generated__/JobControlsPublishMutation.graphql";
import type { JobControlsUnpublishMutation as JobControlsUnpublishMutationType } from "@/__generated__/JobControlsUnpublishMutation.graphql";
import { Button, addToast } from "@heroui/react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";

const JobControlsFragment = graphql`
  fragment JobControlsFragment on Job {
    id
    isActive
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

const JobControlsUnpublishMutation = graphql`
mutation JobControlsUnpublishMutation($jobId: ID!) {
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

type Props = {
	job: JobControlsFragment$key;
};

export default function JobControls({ job }: Props) {
	const data = useFragment(JobControlsFragment, job);
	const [commitPublishMutation, isPublishMutationInFlight] =
		useMutation<JobControlsPublishMutationType>(JobControlsPublishMutation);
	const [commitUnpublishMutation, isUnpublishMutationInFlight] =
		useMutation<JobControlsUnpublishMutationType>(JobControlsUnpublishMutation);

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
	async function handleUnpublishJob() {
		commitUnpublishMutation({
			variables: {
				jobId: data.id,
			},
			onCompleted(response) {
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
	if (data.isActive) {
		return (
			<Button
				onPress={handleUnpublishJob}
				isLoading={isUnpublishMutationInFlight}
			>
				Unpublish job
			</Button>
		);
	}

	return (
		<Button
			color="primary"
			onPress={handlePublishJob}
			isLoading={isPublishMutationInFlight}
		>
			Publish job
		</Button>
	);
}
