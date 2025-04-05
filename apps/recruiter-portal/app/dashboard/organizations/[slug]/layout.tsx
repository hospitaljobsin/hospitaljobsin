import OrgDetailHeader from "@/components/layout/OrgDetailHeader";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<OrgDetailHeader />
			<div className="w-full mx-auto bg-background-600">{children}</div>
		</>
	);
}
