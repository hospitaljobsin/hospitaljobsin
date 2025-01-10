import Header from "@/components/layout/Header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<div className="w-full mx-auto">{children}</div>
		</>
	);
}
