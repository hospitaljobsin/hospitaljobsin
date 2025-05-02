"use client";
import type { layoutOrganizationRootQuery } from "@/__generated__/layoutOrganizationRootQuery.graphql";
import OrgDetailHeader from "@/components/layout/OrgDetailHeader";
import { useParams } from "next/navigation";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

const OrganizationRootLayoutQuery = graphql`
	query layoutOrganizationRootQuery($slug: String!) {
		...OrgDetailHeaderQueryFragment
		organization(slug: $slug) {
			__typename
			... on Organization {
				...OrgDetailHeaderOrganizationFragment
			}
		}
	}
`;

export default function OrganizationRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const slug = useParams<{ slug: string }>().slug;
	const data = useLazyLoadQuery<layoutOrganizationRootQuery>(
		OrganizationRootLayoutQuery,
		{
			slug: slug,
		},
		{ fetchPolicy: "store-or-network" },
	);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' type.",
	);

	return (
		<>
			<OrgDetailHeader organization={data.organization} query={data} />
			<div className="w-full mx-auto bg-background-600">{children}</div>
		</>
	);
}
