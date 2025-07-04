import HeaderClientComponent from "../../components/layout/HeaderClientComponent";

export default function SearchLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full flex flex-col bg-primary-400">
			<HeaderClientComponent variant="default" />
			<div className="w-full mx-auto bg-background-600 h-full">{children}</div>
		</div>
	);
}
