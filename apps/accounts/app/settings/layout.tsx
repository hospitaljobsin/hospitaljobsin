"use client";
import SettingsSidebar from "@/components/settings/Sidebar";
import HeaderClientComponent from "./HeaderClientComponent";

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<HeaderClientComponent />
			<div className="relative w-full h-full">
				<div className="absolute top-0 left-0 w-1/2 h-full bg-background-700" />
				<div className="absolute top-0 right-0 w-1/2 h-full bg-background-600" />
				<div className="relative w-full mx-auto max-w-5xl h-full">
					<div className="flex flex-col md:flex-row h-full bg-background-600">
						<SettingsSidebar />
						<div className="flex-1 px-4 py-6 md:pl-12 bg-background-600 h-full ">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
