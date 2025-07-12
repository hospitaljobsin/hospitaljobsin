"use client";

import AppliedJobsViewSkeleton from "@/components/my-jobs/applied/AppliedJobsViewSkeleton";
import dynamic from "next/dynamic";

const AppliedJobsClientComponent = dynamic(
	() => import("./AppliedJobsClientComponent"),
	{
		ssr: false,
		loading: () => <AppliedJobsViewSkeleton />,
	},
);

export default function AppliedJobsPage() {
	return <AppliedJobsClientComponent />;
}
