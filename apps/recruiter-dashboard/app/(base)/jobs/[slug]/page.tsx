"use client";
import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";

const JobDetailApplicantsClientComponent = dynamic(
	() => import("./JobDetailApplicantsClientComponent"),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-full flex items-center justify-center">
				<Spinner size="lg" />
			</div>
		),
	},
);

export default function JobDetailApplicantsPage() {
	return <JobDetailApplicantsClientComponent />;
}
