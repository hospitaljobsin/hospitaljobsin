"use client";
import OrgSettingsSidebarSkeleton from "@/components/org-settings/SidebarSkeleton";
import dynamic from "next/dynamic";

const SidebarClientComponent = dynamic(
	() => import("@/components/org-settings/SidebarClientComponent"),
	{
		ssr: false,
		loading: () => <OrgSettingsSidebarSkeleton />,
	},
);

export default function OrganizationSettingsLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<>
			<div className="relative w-full h-full">
				<div className="absolute top-0 left-0 w-1/2 h-full bg-background-700" />
				<div className="absolute top-0 right-0 w-1/2 h-full bg-background-600" />
				<div className="relative w-full max-w-7xl">
					<div className="flex flex-col lg:flex-row min-h-screen bg-background-600">
						{/* Sidebar will now grow to fill the height */}
						<SidebarClientComponent />
						<div className="flex-1 px-4 py-6 lg:pl-12 bg-background-600">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
