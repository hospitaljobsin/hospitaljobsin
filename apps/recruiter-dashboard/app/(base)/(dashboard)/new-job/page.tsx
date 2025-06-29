"use client";
import type { pageNewJobQuery } from "@/__generated__/pageNewJobQuery.graphql";
import NewJobContent from "@/components/new-job/NewJobContent";
import useOrganization from "@/lib/hooks/useOrganization";
import { Spinner } from "@heroui/react";
import type { FC } from "react";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const PageNewJobQuery = graphql`
  query pageNewJobQuery($slug: String!) {
	...NewJobContentFragment @arguments(slug: $slug)
  }
`;

const CreateJobPage: FC = () => {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	const orgQueryRef = loadQuery<pageNewJobQuery>(
		environment,
		PageNewJobQuery,
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
};

export default CreateJobPage;
