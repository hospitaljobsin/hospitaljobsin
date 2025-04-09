"use client";
import type { layoutOrganizationMembersQuery } from "@/__generated__/layoutOrganizationMembersQuery.graphql";
import MembersSidebar from "@/components/organization-detail/members-tab/Sidebar";
import { useParams } from "next/navigation";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

const OrganizationMembersLayoutQuery = graphql`
query layoutOrganizationMembersQuery($slug: String!) {
	organization(slug: $slug) {
		__typename
		... on Organization {
			isAdmin
		}	
	}
}`;

export default function OrganizationmembersLayout({
	children,
}: { children: React.ReactNode }) {
	const slug = useParams<{ slug: string }>().slug;
	const data = useLazyLoadQuery<layoutOrganizationMembersQuery>(
		OrganizationMembersLayoutQuery,
		{
			slug: slug,
		},
		{ fetchPolicy: "store-or-network" },
	);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' type.",
	);

	if (data.organization.isAdmin) {
		return (
			<>
				<div className="relative w-full h-full">
					<div className="absolute top-0 left-0 w-1/2 h-full bg-background-700" />
					<div className="absolute top-0 right-0 w-1/2 h-full bg-background-600" />
					<div className="relative w-full mx-auto max-w-5xl">
						<div className="flex flex-col md:flex-row min-h-screen bg-background-600">
							{/* Sidebar will now grow to fill the height */}
							<MembersSidebar />
							<div className="flex-1 px-4 py-6 md:pl-12 bg-background-600">
								{children}
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

	return <div className="w-full mx-auto max-w-5xl px-4 py-6">{children}</div>;
}
