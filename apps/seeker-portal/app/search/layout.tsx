import SearchHeaderClientComponent from "@/components/search/SearchHeaderClientComponent";

export default function SearchLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full flex flex-col bg-primary-400">
			<SearchHeaderClientComponent variant="default" />
			<div className="w-full mx-auto bg-background-600 h-full">{children}</div>
		</div>
	);
}
