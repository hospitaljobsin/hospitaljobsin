import JobSkeleton from "./JobSkeleton";

export default function JobListSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4 pb-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <JobSkeleton key={index} />
      ))}
    </div>
  );
}
