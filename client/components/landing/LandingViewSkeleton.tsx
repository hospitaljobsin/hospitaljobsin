import JobListControllerSkeleton from "./JobListControllerSkeleton";
import JobListSkeleton from "./JobListSkeleton";

export default function LandingViewSkeleton() {
  return (
    <div className="py-8 w-full h-full max-w-7xl mx-auto flex flex-col gap-8">
      <JobListControllerSkeleton />
      <JobListSkeleton />
    </div>
  );
}
