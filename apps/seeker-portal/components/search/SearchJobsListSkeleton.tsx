import { Select, SelectItem, Skeleton } from "@heroui/react";
import JobListSkeleton from "../landing/JobListSkeleton";

export default function SearchJobsListSkeleton() {
	return (
		<div className="w-full flex flex-col gap-4">
			<div className="w-full flex gap-12 justify-between items-center mb-6 sm:mb-8">
				<Skeleton className="rounded-md h-12 w-full" />
				<div className="flex gap-2 w-full sm:max-w-xs">
					<Select
						label="Sort by"
						placeholder="Select sorting option"
						isDisabled
						variant="faded"
						size="sm"
					>
						<SelectItem key="RELEVANCE">Relevance</SelectItem>
						<SelectItem key="UPDATED_AT">Date Posted</SelectItem>
					</Select>
				</div>
			</div>
			<JobListSkeleton />
		</div>
	);
}
