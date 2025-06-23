import type { ApplicantListControllerFragment$key } from "@/__generated__/ApplicantListControllerFragment.graphql";
import type { ApplicantListControllerMutation as ApplicantListControllerMutationType } from "@/__generated__/ApplicantListControllerMutation.graphql";
import type { JobApplicantStatus } from "@/__generated__/ApplicantListPaginationQuery.graphql";
import {
	Button,
	Card,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	Select,
	SelectItem,
} from "@heroui/react";
import { ChevronDown, Sparkles } from "lucide-react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { useApplicantSelection } from "./ApplicantSelectionProvider";

const applicantStatus = [
	{ key: "ALL", label: "All" },
	{ key: "APPLIED", label: "Applied" },
	{ key: "SHORTLISTED", label: "Shortlisted" },
	{ key: "INTERVIEWED", label: "Interviewed" },
	{ key: "ONHOLD", label: "On Hold" },
	{ key: "OFFERED", label: "Offered" },
] as { key: JobApplicantStatus; label: string }[];

export const JOB_APPLICANT_STATUSES = [
	"APPLIED",
	"INTERVIEWED",
	"OFFERED",
	"ONHOLD",
	"SHORTLISTED",
] as JobApplicantStatus[];

const UpdateJobApplicantsStatusMutation = graphql`
	mutation ApplicantListControllerMutation(
		$jobId: ID!
		$applicantIds: [ID!]!
		$status: JobApplicantStatus!
	) {
		updateJobApplicantsStatus(
			jobId: $jobId
			jobApplicantIds: $applicantIds
			status: $status
		) {
			... on UpdateJobApplicantsStatusSuccess {
				jobApplicants {
					id
					slug
					status
					account {
						email
						fullName
						avatarUrl
					}
				}
			}
		}
	}
`;

const ApplicantListControllerFragment = graphql`
	fragment ApplicantListControllerFragment on Job {
		id
	}
`;

interface ApplicantListControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
	status: JobApplicantStatus | null;
	setStatus: (status: JobApplicantStatus | null) => void;
	job: ApplicantListControllerFragment$key;
}

export default function ApplicantListController(
	props: ApplicantListControllerProps,
) {
	const data = useFragment(ApplicantListControllerFragment, props.job);
	const { selectedApplicants, setSelectedApplicants } = useApplicantSelection();
	const [commitMutation, isInFlight] =
		useMutation<ApplicantListControllerMutationType>(
			UpdateJobApplicantsStatusMutation,
		);
	const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === "ALL") {
			props.setStatus(null);
			return;
		}
		props.setStatus(e.target.value as JobApplicantStatus);
	};

	if (selectedApplicants.size > 0)
		return (
			<Card
				fullWidth
				className="flex flex-row justify-between items-center px-6 py-4 w-full"
				shadow="none"
			>
				<p className="text-md">
					{selectedApplicants.size} applicant
					{selectedApplicants.size > 1 ? "s" : ""} selected
				</p>
				<Dropdown>
					<DropdownTrigger>
						<Button
							variant="flat"
							color="primary"
							size="sm"
							endContent={<ChevronDown />}
							isLoading={isInFlight}
						>
							Change Status
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						aria-label="Change applicant status"
						onAction={(key) => {
							commitMutation({
								variables: {
									jobId: data.id,
									applicantIds: Array.from(selectedApplicants),
									status: key as JobApplicantStatus,
								},
								onCompleted: () => {
									setSelectedApplicants(new Set());
								},
							});
						}}
					>
						{JOB_APPLICANT_STATUSES.map((status) => (
							<DropdownItem key={status}>{status}</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</Card>
		);
	return (
		<div className="w-full flex flex-col sm:flex-row items-center gap-8">
			<Input
				size="lg"
				classNames={{
					inputWrapper: "bg-background shadow-none",
				}}
				startContent={
					<Sparkles
						size={20}
						className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-4"
					/>
				}
				isClearable
				placeholder="e.g., 'candidates with 5 years of experience in cardiology'"
				variant="bordered"
				value={props.searchTerm || ""}
				onValueChange={(value) => props.setSearchTerm(value)}
				onClear={() => props.setSearchTerm(null)}
				fullWidth
			/>
			{/* TODO: add sorting controls here */}
			<Select
				label="Status"
				color="primary"
				size="sm"
				className="w-full sm:max-w-xs"
				onChange={handleSelectionChange}
				selectedKeys={props.status ? [props.status] : ["ALL"]}
			>
				{applicantStatus.map((status) => (
					<SelectItem key={status.key}>{status.label}</SelectItem>
				))}
			</Select>
		</div>
	);
}
