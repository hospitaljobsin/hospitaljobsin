import OrgDetailHeaderClientComponent from "./OrgDetailHeaderClientComponent";

export default function OrgDetailLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full flex flex-col">
			<OrgDetailHeaderClientComponent />
			<div className="w-full mx-auto bg-background-600 h-full">
				<div className="w-full px-5 max-w-7xl mx-auto h-full">{children}</div>
			</div>
		</div>
	);
}
