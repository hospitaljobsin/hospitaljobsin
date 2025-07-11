"use client";
import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";

const JobApplicantDetailClientComponent = dynamic(
	() => import("./JobApplicantDetailClientComponent"),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-full flex items-center justify-center">
				<Spinner size="lg" />
			</div>
		),
	},
);

export default function JobApplicantDetailPage() {
	return <JobApplicantDetailClientComponent />;
}
