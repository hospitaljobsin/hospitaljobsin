import type { ApplicantListControllerFragment$key } from "@/__generated__/ApplicantListControllerFragment.graphql";
import type { ApplicantListControllerMutation as ApplicantListControllerMutationType } from "@/__generated__/ApplicantListControllerMutation.graphql";
import type {
	JobApplicantStatus,
	JobApplicantsSortBy,
} from "@/__generated__/ApplicantListPaginationQuery.graphql";
import { useNavigationGuard } from "@/lib/hooks/useFixedNavigationGuard";
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
	type SharedSelection,
	Spinner,
} from "@heroui/react";
import { ChevronDown, Sparkles, XIcon } from "lucide-react";
import { startTransition } from "react";
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
	status: JobApplicantStatus | "ALL";
	setStatus: (status: JobApplicantStatus | "ALL") => void;
	job: ApplicantListControllerFragment$key;
	sortBy: JobApplicantsSortBy | null;
	setSortBy: (sortBy: JobApplicantsSortBy) => void;
	isLoading: boolean;
}

export default function ApplicantListController(
	props: ApplicantListControllerProps,
) {
	const data = useFragment(ApplicantListControllerFragment, props.job);
	const { selectedApplicants, setSelectedApplicants } = useApplicantSelection();

	useNavigationGuard({
		enabled: (params) => selectedApplicants.size > 0,
		confirm: () =>
			window.confirm("You have unsaved changes that will be lost."),
	});

	const [commitMutation, isInFlight] =
		useMutation<ApplicantListControllerMutationType>(
			UpdateJobApplicantsStatusMutation,
		);
	const handleSelectionChange = (keys: SharedSelection) => {
		startTransition(() => {
			if (keys.currentKey === "") {
				props.setStatus("ALL");
				return;
			}
			props.setStatus(keys.currentKey as JobApplicantStatus);
		});
	};
	const handleSortByChange = (keys: SharedSelection) => {
		startTransition(() => {
			if (keys.currentKey === "") {
				props.setSortBy("OVERALL_SCORE");
				return;
			}
			props.setSortBy(keys.currentKey as JobApplicantsSortBy);
		});
	};
	if (selectedApplicants.size > 0)
		return (
			<Card
				fullWidth
				className="flex flex-row justify-between items-center px-2 py-4 w-full"
				shadow="none"
			>
				<div className="flex flex-row items-center gap-4">
					<Button
						variant="light"
						size="sm"
						isIconOnly
						onPress={() => setSelectedApplicants(new Set())}
					>
						<XIcon size={16} />
					</Button>
					<p className="text-md">
						{selectedApplicants.size} applicant
						{selectedApplicants.size > 1 ? "s" : ""} selected
					</p>
				</div>
				<Dropdown>
					<DropdownTrigger>
						<Button
							variant="flat"
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
						{applicantStatus
							.filter((status) => status.key !== ("ALL" as JobApplicantStatus))
							.map((status) => (
								<DropdownItem key={status.key}>{status.label}</DropdownItem>
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
				endContent={
					props.isLoading ? (
						<Spinner
							size="sm"
							variant="simple"
							className="mt-2"
							color="primary"
						/>
					) : null
				}
				isClearable
				placeholder="e.g., 'candidates with 5 years of experience in cardiology'"
				variant="bordered"
				value={props.searchTerm || ""}
				onValueChange={(value) => props.setSearchTerm(value)}
				onClear={() => {
					// we need to wait for the debounce to complete
					setTimeout(() => props.setSearchTerm(null), 0);
				}}
				fullWidth
			/>
			<Select
				label="Status"
				size="sm"
				variant="bordered"
				className="w-full sm:w-sm sm:max-w-xs"
				classNames={{
					trigger: "bg-background",
				}}
				onSelectionChange={handleSelectionChange}
				selectedKeys={props.status ? [props.status] : ["ALL"]}
			>
				{applicantStatus.map((status) => (
					<SelectItem key={status.key}>{status.label}</SelectItem>
				))}
			</Select>
			<Select
				label="Sort By"
				size="sm"
				variant="bordered"
				className="w-full sm:w-sm sm:max-w-xs"
				classNames={{
					trigger: "bg-background",
				}}
				onSelectionChange={handleSortByChange}
				selectedKeys={props.sortBy ? [props.sortBy] : ["OVERALL_SCORE"]}
			>
				<SelectItem key="OVERALL_SCORE">Relevance</SelectItem>
				<SelectItem key="CREATED_AT">Newest First</SelectItem>
			</Select>
		</div>
	);
}
