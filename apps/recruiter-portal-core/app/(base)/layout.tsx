import HeaderClientComponent from "./HeaderClientComponent";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<HeaderClientComponent />
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-7xl mx-auto">{children}</div>
			</div>
		</>
	);
}
