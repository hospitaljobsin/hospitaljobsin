export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="w-full px-5 max-w-5xl mx-auto h-full">{children}</div>;
}
