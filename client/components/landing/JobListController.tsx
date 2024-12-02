import { Input } from "@nextui-org/react";

interface JobListControllerProps {
  searchTerm: string | null;
  setSearchTerm: (searchTerm: string | null) => void;
}

export default function JobListController(props: JobListControllerProps) {
  return (
    <div className="flex items-center justify-center w-full h-full gap-4">
      <Input
        isClearable
        variant="bordered"
        placeholder="Search for jobs..."
        value={props.searchTerm || ""}
        onValueChange={(value) => props.setSearchTerm(value)}
        onClear={() => props.setSearchTerm(null)}
        fullWidth
      />
      <Input
        isClearable
        variant="bordered"
        placeholder="Enter your location"
        fullWidth
      />
      <Input
        isClearable
        variant="bordered"
        placeholder="Within 5km"
        fullWidth
      />
    </div>
  );
}
