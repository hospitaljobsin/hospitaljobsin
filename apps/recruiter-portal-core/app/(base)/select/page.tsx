"use client";

import SelectViewSkeleton from "@/components/select/SelectViewSkeleton";
import dynamic from "next/dynamic";

const SelectClientComponent = dynamic(() => import("./SelectClientComponent"), {
	ssr: false,
	loading: () => <SelectViewSkeleton />,
});

export default function SelectPage() {
	return <SelectClientComponent />;
}
