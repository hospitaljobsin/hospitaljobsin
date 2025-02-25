import Header from "@/components/settings/Header";
import SettingsSidebar from "@/components/settings/Sidebar";

export default function SettingsLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<div className="relative w-full h-full">
				<div className="absolute top-0 left-0 w-1/2 h-screen bg-background-700" />
				<div className="absolute top-0 right-0 w-1/2 h-screen bg-background-600" />
				<div className="relative w-full mx-auto max-w-5xl h-full">
					<div className="flex flex-col md:flex-row h-full">
						<SettingsSidebar />
						<div className="flex-1 p-8 bg-background-600">{children}</div>
					</div>
				</div>
			</div>
		</>
	);
}
