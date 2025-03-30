import { Button, Input } from "@heroui/react";
import { BriefcaseBusiness, Search } from "lucide-react";

interface OrganizationJobsControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
}

export default function OrganizationJobsController(
	props: OrganizationJobsControllerProps,
) {
	return (
		<div className="w-full flex items-center gap-8">
			<Input
				classNames={{
					inputWrapper: "bg-background",
				}}
				startContent={
					<Search
						size={20}
						className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-4"
					/>
				}
				isClearable
				placeholder="Find a job posting..."
				variant="bordered"
				value={props.searchTerm || ""}
				onValueChange={(value) => props.setSearchTerm(value)}
				onClear={() => props.setSearchTerm(null)}
				fullWidth
			/>
			<Button color="primary" startContent={<BriefcaseBusiness size={25} />}>
				New
			</Button>
		</div>
	);
}
