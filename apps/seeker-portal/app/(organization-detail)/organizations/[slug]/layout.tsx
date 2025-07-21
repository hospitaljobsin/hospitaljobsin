import type LayoutOrgDetailQueryNode from "@/__generated__/layoutOrgDetailQuery.graphql";
import type { layoutOrgDetailQuery } from "@/__generated__/layoutOrgDetailQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { graphql } from "relay-runtime";
import OrgDetailHeaderClientComponent from "./OrgDetailHeaderClientComponent";

export const OrgDetailLayoutQuery = graphql`
  query layoutOrgDetailQuery($slug: String!) {
	...OrgDetailHeaderClientComponentFragment @arguments(slug: $slug)
  }
`;

export default async function OrgDetailLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}>) {
	const { slug } = await params;
	console.log("slug: ", slug);
	const preloadedQuery = await loadSerializableQuery<
		typeof LayoutOrgDetailQueryNode,
		layoutOrgDetailQuery
	>(OrgDetailLayoutQuery, {
		slug: slug,
	});
	return (
		<div className="w-full flex flex-col flex-1">
			<OrgDetailHeaderClientComponent preloadedQuery={preloadedQuery} />
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-7xl mx-auto">{children}</div>
			</div>
		</div>
	);
}
