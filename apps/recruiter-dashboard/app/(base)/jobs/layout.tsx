"use client";

import JobDetailHeaderClientComponent from "@/components/job-detail/JobDetailHeaderClientComponent";

export default function JobRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-full flex flex-col">
			<JobDetailHeaderClientComponent />
			<div className="w-full mx-auto bg-background-600 max-w-7xl flex-1">
				{children}
			</div>
		</div>
	);
}
