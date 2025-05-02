"use client";
import type { layoutOrgDetailQuery } from "@/__generated__/layoutOrgDetailQuery.graphql";
import OrgDetailHeader from "@/components/layout/OrgDetailHeader";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";

const OrgDetailLayoutQuery = graphql`
  query layoutOrgDetailQuery($slug: String!) {
	...OrgDetailHeaderQueryFragment
	organization(slug: $slug) {
		__typename
		...OrgDetailHeaderOrganizationFragment
	}
  }
`;

export default function OrgDetailLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const slug = useParams<{ slug: string }>().slug;
	const data = useLazyLoadQuery<layoutOrgDetailQuery>(
		OrgDetailLayoutQuery,
		{ slug: slug },
		{ fetchPolicy: "store-or-network" },
	);
	return (
		<div className="w-full h-full flex flex-col">
			<Suspense>
				<OrgDetailHeader organization={data.organization} query={data} />
			</Suspense>
			<div className="w-full mx-auto bg-background-600 h-full">
				<div className="w-full px-5 max-w-5xl mx-auto h-full">{children}</div>
			</div>
		</div>
	);
}
