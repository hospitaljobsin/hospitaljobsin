import Header from "@/components/layout/Header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<div className="w-full px-5 max-w-5xl mx-auto">{children}</div>
		</>
	);
}
