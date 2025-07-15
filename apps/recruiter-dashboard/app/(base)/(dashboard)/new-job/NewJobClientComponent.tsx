"use client";
import type { NewJobClientComponentQuery as NewJobClientComponentQueryType } from "@/__generated__/NewJobClientComponentQuery.graphql";
import NewJobContent from "@/components/new-job/NewJobView";
import useOrganization from "@/lib/hooks/useOrganization";
import { Spinner } from "@heroui/react";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const NewJobClientComponentQuery = graphql`
  query NewJobClientComponentQuery($slug: String!) {
	...NewJobViewFragment @arguments(slug: $slug)
  }
`;

export default function NewJobClientComponent() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	const orgQueryRef = loadQuery<NewJobClientComponentQueryType>(
		environment,
		NewJobClientComponentQuery,
		{
			slug: organizationSlug,
		},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense
			fallback={
				<div className="flex justify-center items-center w-full h-full">
					<Spinner size="lg" />
				</div>
			}
		>
			<NewJobContent initialQueryRef={orgQueryRef} />
		</Suspense>
	);
}
