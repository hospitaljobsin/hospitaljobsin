"use client";
import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";

const NewJobClientComponent = dynamic(() => import("./NewJobClientComponent"), {
	ssr: false,
	loading: () => (
		<div className="flex justify-center items-center w-full h-full">
			<Spinner size="lg" />
		</div>
	),
});

export default function NewJobPage() {
	return <NewJobClientComponent />;
}
