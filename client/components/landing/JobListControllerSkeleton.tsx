"use client";
// mark component as client until the select component is marked as client only
// https://github.com/nextui-org/nextui/issues/1403
import { Input, Select, SelectItem } from "@nextui-org/react";
import { distances } from "./JobListController";

export default function JobListControllerSkeleton() {
  return (
    <div className="flex items-center justify-center w-full h-full gap-4">
      <Input
        label="Search Term"
        isClearable
        variant="bordered"
        isDisabled
        fullWidth
      />
      <Input
        label="Location"
        isClearable
        variant="bordered"
        fullWidth
        isDisabled
      />
      <Select variant="bordered" label="Distance" isDisabled>
        {distances.map((distance) => (
          <SelectItem key={distance}>{distance}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
