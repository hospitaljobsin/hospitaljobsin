import { Input } from "@nextui-org/react";

interface JobListControllerProps {
  searchTerm: string | null;
  setSearchTerm: (searchTerm: string | null) => void;
}

export default function JobListController(props: JobListControllerProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Input
        isClearable
        type="email"
        variant="bordered"
        placeholder="Search for jobs..."
        value={props.searchTerm || ""}
        onValueChange={(value) => props.setSearchTerm(value)}
        onClear={() => props.setSearchTerm(null)}
        fullWidth
      />
    </div>
  );
}
