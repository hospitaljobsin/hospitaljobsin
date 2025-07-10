import DashboardHeaderClientComponent from "@/components/layout/DashboardHeaderClientComponent";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full flex flex-col flex-1 h-full">
			<DashboardHeaderClientComponent />
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-7xl mx-auto">{children}</div>
			</div>
		</div>
	);
}
