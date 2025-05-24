import SettingsSidebar from "@/components/organization-detail/settings-tab/Sidebar";

export default function OrganizationSettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="relative w-full h-full">
				<div className="absolute top-0 left-0 w-1/2 h-full bg-background-700" />
				<div className="absolute top-0 right-0 w-1/2 h-full bg-background-600" />
				<div className="relative w-full mx-auto max-w-5xl">
					<div className="flex flex-col md:flex-row min-h-screen bg-background-600">
						{/* Sidebar will now grow to fill the height */}
						<SettingsSidebar />
						<div className="flex-1 px-4 py-6 md:pl-12 bg-background-600">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
