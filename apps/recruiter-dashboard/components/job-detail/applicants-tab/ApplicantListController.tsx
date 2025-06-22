import type { JobApplicantStatus } from "@/__generated__/ApplicantListPaginationQuery.graphql";
import { Button, Input, Select, SelectItem, Slider } from "@heroui/react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface ApplicantListControllerProps {
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

export default function ApplicantListController(
	props: ApplicantListControllerProps,
) {
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
	const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === "ALL") {
			props.setStatus(null);
			return;
		}
		props.setStatus(e.target.value as JobApplicantStatus);
	};
	return (
		<div className="w-full flex flex-col gap-4">
			<div className="w-full flex flex-col sm:flex-row items-center gap-8">
				<Input
					size="lg"
					label="AI-Powered Search"
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
					placeholder="e.g., 'a nurse with 5 years of experience in cardiology'"
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
				<Button
					isIconOnly
					variant="flat"
					onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
				>
					<SlidersHorizontal />
				</Button>
			</div>
			{showAdvancedFilters && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
					<Input placeholder="Location" />
					<Input placeholder="Skills" />
					<Slider
						label="Experience (years)"
						step={1}
						maxValue={30}
						minValue={0}
						defaultValue={[0, 10]}
					/>
				</div>
			)}
		</div>
	);
}
