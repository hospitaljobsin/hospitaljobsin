"usw client"
import JobListControllerSkeleton from "./JobListControllerSkeleton";
import JobListSkeleton from "./JobListSkeleton";

export default function LandingViewSkeleton() {
	return (
		<div className="w-full h-full flex flex-col mt-4 sm:-mt-20 gap-4 sm:gap-8">
			<JobListControllerSkeleton />
			<JobListSkeleton />
		</div>
	);
}
