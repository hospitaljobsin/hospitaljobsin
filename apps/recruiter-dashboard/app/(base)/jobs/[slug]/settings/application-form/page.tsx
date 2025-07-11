"use client";
import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";

const JobApplicationFormSettingsClientComponent = dynamic(
	() => import("./JobApplicationFormSettingsClientComponent"),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-full flex items-center justify-center">
				<Spinner size="lg" />
			</div>
		),
	},
);

export default function JobApplicationFormSettingsPage() {
	return <JobApplicationFormSettingsClientComponent />;
}
