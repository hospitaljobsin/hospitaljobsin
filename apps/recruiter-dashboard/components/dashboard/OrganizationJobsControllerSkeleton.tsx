import { Input, Select, SelectItem } from "@heroui/react";
import { Search } from "lucide-react";

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

export default function OrganizationJobsControllerSkeleton() {
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
				isDisabled
				fullWidth
			/>
			<Select
				label="Sort By"
				className="w-full sm:w-sm sm:max-w-xs"
				classNames={{
					trigger: "bg-background",
				}}
				aria-label="Sort by"
				selectedKeys={[]}
				isDisabled
				size="sm"
				variant="bordered"
			>
				{SORT_OPTIONS.map((option) => (
					<SelectItem key={option.value}>{option.label}</SelectItem>
				))}
			</Select>
		</div>
	);
}
