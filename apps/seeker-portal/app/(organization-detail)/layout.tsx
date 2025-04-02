import OrgDetailHeader from "@/components/layout/OrgDetailHeader";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full flex flex-col">
			<OrgDetailHeader />
			<div className="w-full mx-auto bg-background-600 h-full">
				<div className="w-full px-5 max-w-5xl mx-auto h-full">{children}</div>
			</div>
		</div>
	);
}
