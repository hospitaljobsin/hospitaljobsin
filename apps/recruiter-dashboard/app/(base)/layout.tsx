"use client";

import SidebarSkeleton from "@/components/layout/SidebarSkeleton";
import dynamic from "next/dynamic";

const SidebarClientComponent = dynamic(
	() => import("@/components/layout/SidebarClientComponent"),
	{
		ssr: false,
		loading: () => <SidebarSkeleton />,
	},
);

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col h-full w-full">
			<div className="flex flex-1 h-full w-full mx-auto flex-col lg:flex-row">
				<SidebarClientComponent />
				<div className="flex-1 h-full w-full overflow-y-auto lg:pr-4">
					{children}
				</div>
			</div>
		</div>
	);
}
