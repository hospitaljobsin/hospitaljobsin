"use client";
import SettingsSidebarSkeleton from "@/components/job-detail/settings-tab/SettingsSidebarSkeleton";
import dynamic from "next/dynamic";

const SettingsSidebarClientComponent = dynamic(
	() =>
		import(
			"@/components/job-detail/settings-tab/SettingsSidebarClientComponent"
		),
	{
		ssr: false,
		loading: () => <SettingsSidebarSkeleton />,
	},
);

export default function JobSettingsLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<>
			<div className="relative w-full h-full">
				<div className="absolute top-0 left-0 w-1/2 h-full bg-background-600" />
				<div className="absolute top-0 right-0 w-1/2 h-full bg-background-600" />
				<div className="relative w-full mx-auto max-w-7xl h-full">
					<div className="flex flex-col md:flex-row h-full bg-background-600">
						{/* Sidebar will now grow to fill the height */}
						<SettingsSidebarClientComponent />
						<div className="flex-1 px-4 pt-2 pb-6 md:pt-6 md:pl-6 bg-background-600 h-full">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
