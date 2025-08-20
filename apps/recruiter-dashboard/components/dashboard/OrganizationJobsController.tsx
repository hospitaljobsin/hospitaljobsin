import type { OrganizationJobsControllerFragment$key } from "@/__generated__/OrganizationJobsControllerFragment.graphql";
import links from "@/lib/links";
import {
	Button,
	Input,
	Select,
	SelectItem,
	type SharedSelection,
} from "@heroui/react";
import { BriefcaseBusiness, Search } from "lucide-react";
import Link from "next/link";
import { startTransition } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

interface OrganizationJobsControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
	organization: OrganizationJobsControllerFragment$key;
	sortBy: JobSortBy;
	setSortBy: (sortBy: JobSortBy) => void;
}

const OrganizationJobsControllerFragment = graphql`
	fragment OrganizationJobsControllerFragment on Organization {
		isAdmin
	}
`;

// Define the enum for sort options to match the backend
export enum JobSortBy {
	CREATED_AT = "CREATED_AT",
	UPDATED_AT = "UPDATED_AT",
	ALPHABETICAL = "ALPHABETICAL",
	LAST_APPLICANT_APPLIED_AT = "LAST_APPLICANT_APPLIED_AT",
}

const SORT_OPTIONS = [
	{ value: JobSortBy.LAST_APPLICANT_APPLIED_AT, label: "Latest Applications" },
	{ value: JobSortBy.CREATED_AT, label: "Newest First" },
	{ value: JobSortBy.UPDATED_AT, label: "Recently Updated" },
	{ value: JobSortBy.ALPHABETICAL, label: "Alphabetical" },
];

export default function OrganizationJobsController(
	props: OrganizationJobsControllerProps,
) {
	const data = useFragment(
		OrganizationJobsControllerFragment,
		props.organization,
	);

	const handleSortByChange = (keys: SharedSelection) => {
		startTransition(() => {
			if (keys.currentKey === "") {
				props.setSortBy(JobSortBy.LAST_APPLICANT_APPLIED_AT);
				return;
			}
			props.setSortBy(keys.currentKey as JobSortBy);
		});
	};

	return (
		<div className="w-full flex flex-col sm:flex-row items-center gap-8">
			<Input
				classNames={{
					inputWrapper: "bg-background shadow-none",
				}}
				startContent={
					<Search
						size={20}
						className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-4"
					/>
				}
				isClearable
				size="lg"
				placeholder="Find a job posting..."
				variant="bordered"
				value={props.searchTerm || ""}
				onValueChange={(value) => {
					if (value === "") {
						props.setSearchTerm(null);
						return;
					}
					props.setSearchTerm(value);
				}}
				onClear={() => props.setSearchTerm(null)}
				fullWidth
			/>
			<Select
				label="Sort By"
				className="w-full sm:w-sm sm:max-w-xs"
				classNames={{
					trigger: "bg-background",
				}}
				aria-label="Sort by"
				selectedKeys={props.sortBy ? [props.sortBy] : ["CREATED_AT"]}
				onSelectionChange={handleSortByChange}
				size="sm"
				variant="bordered"
			>
				{SORT_OPTIONS.map((option) => (
					<SelectItem key={option.value}>{option.label}</SelectItem>
				))}
			</Select>
			{data.isAdmin && (
				<Button
					as={Link}
					href={links.organizationCreateJob}
					color="primary"
					startContent={<BriefcaseBusiness size={20} />}
					className="w-full sm:w-auto min-w-24"
				>
					New
				</Button>
			)}
		</div>
	);
}
