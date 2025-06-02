import ChatInterface from "@/components/ChatInterface";
import HeaderClientComponent from "@/components/layout/HeaderClientComponent";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col h-full w-full">
			<HeaderClientComponent />
			<div className="w-full mx-auto grow">
				<div className="w-full px-5 max-w-5xl mx-auto">{children}</div>
			</div>
			<ChatInterface placeholder="What do you want to do today?" />
		</div>
	);
}
