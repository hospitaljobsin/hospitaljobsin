"use client";
import type {
	ApplicantStatusUpdaterMutation,
	JobApplicantStatus,
} from "@/__generated__/ApplicantStatusUpdaterMutation.graphql";
import type { ApplicantStatusUpdater_job$key } from "@/__generated__/ApplicantStatusUpdater_job.graphql";
import { Select, SelectItem, addToast } from "@heroui/react";
import { graphql, useFragment, useMutation } from "react-relay";

const ApplicantStatusUpdaterJobFragment = graphql`
	fragment ApplicantStatusUpdater_job on JobApplicant {
		id
		job @required(action: THROW) {
			id
		}
	}
`;

const UpdateStatusMutation = graphql`
	mutation ApplicantStatusUpdaterMutation(
		$jobId: ID!
		$applicantIds: [ID!]!
		$status: JobApplicantStatus!
	) {
		updateJobApplicantsStatus(
			jobId: $jobId
			jobApplicantIds: $applicantIds
			status: $status
		) {
			__typename
			... on UpdateJobApplicantsStatusSuccess {
				jobApplicants {
					id
					status
				}
			}
			... on JobNotFoundError {
				message
			}
			... on JobIsExternalError {
				message
			}
			... on JobApplicantsNotFoundError {
				message
			}
			... on OrganizationAuthorizationError {
				message
			}
		}
	}
`;

const statuses: JobApplicantStatus[] = [
	"APPLIED",
	"SHORTLISTED",
	"INTERVIEWED",
	"OFFERED",
	"ONHOLD",
];

export default function ApplicantStatusUpdater({
	currentStatus,
	applicant,
}: {
	currentStatus: JobApplicantStatus;
	applicant: ApplicantStatusUpdater_job$key;
}) {
	const data = useFragment(ApplicantStatusUpdaterJobFragment, applicant);
	const [commitMutation, isMutationInFlight] =
		useMutation<ApplicantStatusUpdaterMutation>(UpdateStatusMutation);

	const handleStatusChange = (status: JobApplicantStatus) => {
		commitMutation({
			variables: {
				jobId: data.job.id,
				applicantIds: [data.id],
				status,
			},
			onCompleted: (response, errors) => {
				if (errors) {
					addToast({
						title: "Error",
						description: errors[0].message,
						color: "danger",
					});
					return;
				}
				switch (response.updateJobApplicantsStatus?.__typename) {
					case "UpdateJobApplicantsStatusSuccess":
						addToast({
							title: "Success",
							description: "Status updated successfully",
							color: "success",
						});
						break;
					case "JobNotFoundError":
					case "JobIsExternalError":
					case "JobApplicantsNotFoundError":
					case "OrganizationAuthorizationError":
						addToast({
							title: "Error",
							description: response.updateJobApplicantsStatus.message,
							color: "danger",
						});
						break;
					default:
						addToast({
							title: "Error",
							description: "An unknown error occurred",
							color: "danger",
						});
						break;
				}
			},
			onError: (error) => {
				addToast({
					title: "Error",
					description: error.message,
					color: "danger",
				});
			},
		});
	};

	return (
		<div className="w-full max-w-sm" data-prevent-progress>
			<Select
				defaultSelectedKeys={[currentStatus]}
				onSelectionChange={(keys) =>
					handleStatusChange(Array.from(keys)[0] as JobApplicantStatus)
				}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				aria-label="Update applicant status"
				isDisabled={isMutationInFlight}
			>
				{statuses.map((status) => (
					<SelectItem key={status}>
						{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
					</SelectItem>
				))}
			</Select>
		</div>
	);
}
