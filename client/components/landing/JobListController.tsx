import { Input, Select, SelectItem } from "@nextui-org/react";

interface JobListControllerProps {
  searchTerm: string | null;
  setSearchTerm: (searchTerm: string | null) => void;
}

export const distances = [
  "5 Kilometres",
  "10 Kilometres",
  "25 Kilometres",
  "50 Kilometres",
  "100 Kilometres",
  "Any",
];

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
      <Select variant="bordered" label="Distance">
        {distances.map((distance) => (
          <SelectItem key={distance}>{distance}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
