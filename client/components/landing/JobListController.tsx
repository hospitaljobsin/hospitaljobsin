import { Input, Slider } from "@nextui-org/react";

interface JobListControllerProps {
  searchTerm: string | null;
  setSearchTerm: (searchTerm: string | null) => void;
}

export default function JobListController(props: JobListControllerProps) {
  return (
    <div className="flex items-center justify-center w-full h-full gap-4">
      <Input
        label="Search Term"
        isClearable
        variant="bordered"
        value={props.searchTerm || ""}
        onValueChange={(value) => props.setSearchTerm(value)}
        onClear={() => props.setSearchTerm(null)}
        fullWidth
      />
      <Input label="Location" isClearable variant="bordered" fullWidth />
      <Slider
        color="foreground"
        size="md"
        defaultValue={0.0}
        formatOptions={{ style: "unit", unit: "kilometer" }}
        label="Distance"
        maxValue={100}
        minValue={0}
        step={10}
      />
    </div>
  );
}
