import JobSkeleton from "./JobSkeleton";

export default function OrganizationJobsListSkeleton() {
	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{Array.from({ length: 8 }).map((_, index) => (
				<JobSkeleton key={`job-skeleton-${index}`} />
			))}
		</div>
	);
}
