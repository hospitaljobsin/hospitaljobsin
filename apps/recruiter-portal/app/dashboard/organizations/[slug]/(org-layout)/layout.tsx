"use client";
import type { OrgDetailHeaderQuery as OrgDetailHeaderQueryType } from "@/__generated__/OrgDetailHeaderQuery.graphql";
import OrgDetailHeader, {
	OrgDetailHeaderQuery,
} from "@/components/layout/OrgDetailHeader";
import { useParams } from "next/navigation";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function OrganizationRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const slug = useParams<{ slug: string }>().slug;
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<OrgDetailHeaderQueryType>(
		environment,
		OrgDetailHeaderQuery,
		{
			slug: slug,
		},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<>
			<OrgDetailHeader queryReference={queryReference} />
			<div className="w-full mx-auto bg-background-600">{children}</div>
		</>
	);
}
