import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";

interface JobListControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
}

export default function JobListController(props: JobListControllerProps) {
	return (
		<Input
			size="lg"
			classNames={{
				inputWrapper: "p-8 bg-background",
				mainWrapper: "-mt-20",
			}}
			startContent={
				<Search
					size={24}
					className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-4"
				/>
			}
			isClearable
			placeholder="Search for jobs, in plain English"
			variant="bordered"
			value={props.searchTerm || ""}
			onValueChange={(value) => props.setSearchTerm(value)}
			onClear={() => props.setSearchTerm(null)}
			fullWidth
		/>
	);
}
