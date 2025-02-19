import { Input } from "@heroui/react";
import { Search } from "lucide-react";

export default function JobListControllerSkeleton() {
	return (
		<Input
			size="lg"
			classNames={{
				inputWrapper: "p-4 sm:p-8 bg-background",
				mainWrapper: "mt-4 sm:-mt-20",
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
			fullWidth
		/>
	);
}
