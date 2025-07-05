import OrgDetailHeaderClientComponent from "./OrgDetailHeaderClientComponent";

export default function OrgDetailLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full flex flex-col flex-1">
			<OrgDetailHeaderClientComponent />
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-7xl mx-auto">{children}</div>
			</div>
		</div>
	);
}
