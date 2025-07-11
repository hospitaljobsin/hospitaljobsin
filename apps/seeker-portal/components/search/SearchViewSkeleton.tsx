import { Button } from "@heroui/react";
import { FilterIcon } from "lucide-react";
import JobListSkeleton from "../landing/JobListSkeleton";
import FilterSidebarSkeleton from "./FilterSidebarSkeleton";
import SearchHeaderSkeleton from "./SearchHeaderSkeleton";

export default function SearchViewSkeleton() {
	return (
		<div className="w-full flex flex-col bg-background-600">
			<SearchHeaderSkeleton />
			<div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 mx-auto max-w-7xl py-6 px-4 bg-background-600">
				{/* Mobile filter button */}
				<div className="block lg:hidden mb-4">
					<Button
						variant="solid"
						startContent={<FilterIcon size={18} />}
						isDisabled
						fullWidth
					>
						Show Filters
					</Button>
				</div>
				{/* Desktop sidebar */}
				<div className="hidden lg:block lg:w-auto lg:sticky lg:top-20 lg:self-start">
					<FilterSidebarSkeleton />
				</div>
				<div className="flex-1">
					<JobListSkeleton />
				</div>
			</div>
		</div>
	);
}
