"use client";
import type { OrgDetailHeaderQuery as OrgDetailHeaderQueryType } from "@/__generated__/OrgDetailHeaderQuery.graphql";
import OrgDetailHeader, {
	OrgDetailHeaderQuery,
} from "@/components/layout/OrgDetailHeader";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { loadQuery } from "react-relay";

export default function OrgDetailLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const slug = useParams<{ slug: string }>().slug;
	const queryReference = loadQuery<OrgDetailHeaderQueryType>(
		getCurrentEnvironment(),
		OrgDetailHeaderQuery,
		{ slug: slug },
		{ fetchPolicy: "store-or-network" },
	);
	return (
		<div className="w-full h-full flex flex-col">
			<Suspense>
				<OrgDetailHeader queryReference={queryReference} />
			</Suspense>
			<div className="w-full mx-auto bg-background-600 h-full">
				<div className="w-full px-5 max-w-5xl mx-auto h-full">{children}</div>
			</div>
		</div>
	);
}
