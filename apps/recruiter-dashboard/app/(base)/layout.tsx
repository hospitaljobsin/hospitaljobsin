"use client";

import SidebarClientComponent from "@/components/layout/SidebarClientComponent";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col h-full w-full">
			<div className="flex flex-1 h-full w-full mx-auto flex-col md:flex-row">
				<SidebarClientComponent />
				<div className="flex-1 min-w-0 h-full overflow-hidden">{children}</div>
			</div>
		</div>
	);
}
