"use client";
import JobListSkeleton from "./JobListSkeleton";
import OrganizationJobsControllerSkeleton from "./OrganizationJobsControllerSkeleton";

export default function DashboardViewSkeleton() {
	return (
		<div className="w-full h-full flex flex-col relative">
			<div className="sticky top-0 z-10 px-6 pt-8 pb-4">
				<OrganizationJobsControllerSkeleton />
			</div>
			<div className="flex-1 h-full overflow-y-auto px-6 py-8 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-w-2.5 scrollbar-thumb-[hsl(var(--heroui-foreground-300))] scrollbar-track-transparent">
				<JobListSkeleton />
			</div>
		</div>
	);
}
