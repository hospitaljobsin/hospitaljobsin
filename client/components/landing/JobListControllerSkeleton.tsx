"use client";
// mark component as client until the select component is marked as client only
// https://github.com/nextui-org/nextui/issues/1403
import { Input, Select, SelectItem } from "@nextui-org/react";
import { distances } from "./JobListController";

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
      <Select placeholder="Distance" variant="bordered">
        {distances.map((distance) => (
          <SelectItem key={distance}>{distance}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
