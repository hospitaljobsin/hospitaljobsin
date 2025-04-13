import type { JobApplicantStatus } from "@/__generated__/ApplicantListPaginationQuery.graphql";
import { Input, Select, SelectItem } from "@heroui/react";
import { Search } from "lucide-react";

interface ApplicantControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
	status: JobApplicantStatus | null;
	setStatus: (status: JobApplicantStatus | null) => void;
}

const applicantStatus = [
	{ key: "ALL", label: "All" },
	{ key: "APPLIED", label: "Applied" },
	{ key: "SHORTLISTED", label: "Shortlisted" },
	{ key: "INTERVIEWED", label: "Interviewed" },
	{ key: "ONHOLD", label: "On Hold" },
	{ key: "OFFERED", label: "Offered" },
] as { key: JobApplicantStatus; label: string }[];

export default function ApplicantController(props: ApplicantControllerProps) {
	const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === "ALL") {
			props.setStatus(null);
			return;
		}
		props.setStatus(e.target.value as JobApplicantStatus);
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
				placeholder="Find an applicant..."
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
				className="max-w-xs"
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
