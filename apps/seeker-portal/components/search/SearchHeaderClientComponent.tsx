"use client";

import type { SearchHeaderQuery as SearchHeaderQueryType } from "@/__generated__/SearchHeaderQuery.graphql";
import SearchHeader, {
	SearchHeaderQuery,
} from "@/components/search/SearchHeader";
import SearchHeaderSkeleton from "@/components/search/SearchHeaderSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function SearchHeaderClientComponent({
	speciality,
	setSpeciality,
}: {
	speciality: string;
	setSpeciality: (value: string) => void;
}) {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<SearchHeaderQueryType>(
		environment,
		SearchHeaderQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<SearchHeaderSkeleton />}>
			<SearchHeader
				queryReference={queryReference}
				speciality={speciality}
				setSpeciality={setSpeciality}
			/>
		</Suspense>
	);
}
