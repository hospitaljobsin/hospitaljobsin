import DashboardHeaderClientComponent from "@/components/layout/DashboardHeaderClientComponent";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full flex flex-col">
			<DashboardHeaderClientComponent />
			<div className="w-full mx-auto bg-background-600 h-full">
				<div className="w-full px-5 max-w-7xl mx-auto h-full">{children}</div>
			</div>
		</div>
	);
}
