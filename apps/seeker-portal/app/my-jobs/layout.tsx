import MyJobsHeaderClientComponent from "./MyJobsHeaderClientComponent";

export default function MyJobsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full flex flex-col">
			<MyJobsHeaderClientComponent />
			<div className="w-full mx-auto bg-background-600 h-full">
				<div className="w-full px-5 max-w-5xl mx-auto h-full">{children}</div>
			</div>
		</div>
	);
}
