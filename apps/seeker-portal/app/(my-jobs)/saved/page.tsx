"use client";
import SavedJobsViewSkeleton from "@/components/my-jobs/saved/SavedJobsViewSkeleton";
import dynamic from "next/dynamic";

const SavedJobsClientComponent = dynamic(
	() => import("./SavedJobsClientComponent"),
	{
		ssr: false,
		loading: () => <SavedJobsViewSkeleton />,
	},
);

export default function SavedJobsPage() {
	return <SavedJobsClientComponent />;
}
