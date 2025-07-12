"use client";
import JobListSkeleton from "@/components/landing/JobListSkeleton";

export default function AppliedJobsViewSkeleton() {
	return (
		<div className="w-full flex flex-col h-full py-8">
			<JobListSkeleton />
		</div>
	);
}
