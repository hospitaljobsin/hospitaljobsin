import JobSkeleton from "./JobSkeleton";

export default function JobListSkeleton({
	count = 8,
}: {
	count?: number;
}) {
	return (
		<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
			{Array.from({ length: count }).map((_, index) => (
				<JobSkeleton key={`job-skeleton${index}`} />
			))}
		</div>
	);
}
