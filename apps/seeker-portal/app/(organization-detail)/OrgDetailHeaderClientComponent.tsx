"use client";
import type { OrgDetailHeaderQuery as OrgDetailHeaderQueryType } from "@/__generated__/OrgDetailHeaderQuery.graphql";
import OrgDetailHeader, {
	OrgDetailHeaderQuery,
} from "@/components/layout/OrgDetailHeader";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function OrgDetailHeaderClientComponent() {
	const slug = useParams<{ slug: string }>().slug;
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<OrgDetailHeaderQueryType>(
		environment,
		OrgDetailHeaderQuery,
		{ slug: slug },
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);
	return (
		<Suspense>
			<OrgDetailHeader queryReference={queryReference} />
		</Suspense>
	);
}
