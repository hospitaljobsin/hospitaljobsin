import ChatInterface from "@/components/ChatInterface";
import HeaderClientComponent from "@/components/layout/HeaderClientComponent";
import { ORG_SUBDOMAIN_HEADER_NAME } from "@/lib/constants";
import { headers } from "next/headers";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const organizationSlug = headersList.get(ORG_SUBDOMAIN_HEADER_NAME);

	return (
		<div className="flex flex-col h-full w-full">
			<HeaderClientComponent organizationSlug={organizationSlug} />
			<div className="w-full mx-auto grow">
				<div className="w-full px-5 max-w-5xl mx-auto">{children}</div>
			</div>
			<ChatInterface placeholder="What do you want to do today?" />
		</div>
	);
}
