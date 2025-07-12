"use client";

import JobDetailHeaderSkeleton from "@/components/job-detail/JobDetailHeaderSkeleton";
import dynamic from "next/dynamic";

const JobDetailHeaderClientComponent = dynamic(
	() => import("@/components/job-detail/JobDetailHeaderClientComponent"),
	{
		ssr: false,
		loading: () => <JobDetailHeaderSkeleton />,
	},
);

export default function JobRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-full flex flex-col w-full">
			<JobDetailHeaderClientComponent />
			<div className="w-full bg-background-600 max-w-7xl flex-1">
				{children}
			</div>
		</div>
	);
}
