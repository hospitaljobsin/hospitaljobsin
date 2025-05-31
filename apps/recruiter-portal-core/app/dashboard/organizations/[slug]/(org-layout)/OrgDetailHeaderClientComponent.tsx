"use client";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import type { OrgDetailHeaderQuery as OrgDetailHeaderQueryType } from "@/__generated__/OrgDetailHeaderQuery.graphql";
import OrgDetailHeader, {
	OrgDetailHeaderQuery,
} from "@/components/layout/OrgDetailHeader";

export default function OrgDetailHeaderClientComponent() {
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
		<Suspense>
			<OrgDetailHeader queryReference={queryReference} />
		</Suspense>
	);
}
