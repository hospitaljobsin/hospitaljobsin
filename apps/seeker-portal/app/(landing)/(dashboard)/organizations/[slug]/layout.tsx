"use client";
import OrganizationTabs from "@/components/organization-detail/OrganizationTabs";
import { useParams } from "next/navigation";
import { graphql, useLazyLoadQuery } from "react-relay";

const OrganizationDetailLayoutQuery = graphql`
 query layoutOrganizationDetailQuery($slug: String!) {
        ...OrganizationTabsFragment @arguments(slug: $slug)
    }
`;

export default function OrganizationDetailLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const params = useParams<{ slug: string }>();
	const rootQuery = useLazyLoadQuery(OrganizationDetailLayoutQuery, {
		slug: params.slug,
	});
	return (
		<div className="py-4 w-full h-full flex flex-col items-center gap-2">
			<OrganizationTabs rootQuery={rootQuery} />
			{children}
		</div>
	);
}
