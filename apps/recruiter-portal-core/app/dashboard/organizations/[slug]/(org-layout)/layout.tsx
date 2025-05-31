import OrgDetailHeaderClientComponent from "./OrgDetailHeaderClientComponent";

export default function OrganizationRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<OrgDetailHeaderClientComponent />
			<div className="w-full mx-auto bg-background-600">{children}</div>
		</>
	);
}
