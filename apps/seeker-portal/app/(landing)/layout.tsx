import Header from "@/components/layout/Header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full flex flex-col">
			<Header />
			<div className="w-full mx-auto bg-foreground-100 h-full">{children}</div>
		</div>
	);
}
