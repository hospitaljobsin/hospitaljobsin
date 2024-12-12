"use client";
// mark component as client until the select component is marked as client only
// https://github.com/nextui-org/nextui/issues/1403
import { Input, Slider } from "@nextui-org/react";

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
      <Slider
        color="foreground"
        isDisabled
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
