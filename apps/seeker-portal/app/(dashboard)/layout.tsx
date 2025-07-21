import type LayoutDashboardQueryNode from "@/__generated__/layoutDashboardQuery.graphql";
import type { layoutDashboardQuery } from "@/__generated__/layoutDashboardQuery.graphql";
import DashboardHeaderClientComponent from "@/components/layout/DashboardHeaderClientComponent";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { graphql } from "relay-runtime";

export const DashboardLayoutQuery = graphql`
  query layoutDashboardQuery {
	...DashboardHeaderClientComponentFragment
  }
`;

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const preloadedQuery = await loadSerializableQuery<
		typeof LayoutDashboardQueryNode,
		layoutDashboardQuery
	>(DashboardLayoutQuery, {});
	return (
		<div className="w-full flex flex-col flex-1 h-full">
			<DashboardHeaderClientComponent preloadedQuery={preloadedQuery} />
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-7xl mx-auto">{children}</div>
			</div>
		</div>
	);
}
