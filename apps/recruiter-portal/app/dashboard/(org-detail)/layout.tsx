import OrgDetailHeader from "@/components/layout/OrgDetailHeader";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<OrgDetailHeader />
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-5xl mx-auto">{children}</div>
			</div>
		</>
	);
}
