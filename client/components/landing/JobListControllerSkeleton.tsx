import { Input } from "@nextui-org/react";

export default function JobListControllerSkeleton() {
  return (
    <div className="flex items-center justify-center w-full h-full gap-4">
      <Input
        isClearable
        variant="bordered"
        placeholder="Search for jobs..."
        disabled
        fullWidth
      />
      <Input
        isClearable
        variant="bordered"
        placeholder="Enter your location"
        fullWidth
        disabled
      />
      <Input
        isClearable
        variant="bordered"
        placeholder="Within 5km"
        fullWidth
        disabled
      />
    </div>
  );
}
