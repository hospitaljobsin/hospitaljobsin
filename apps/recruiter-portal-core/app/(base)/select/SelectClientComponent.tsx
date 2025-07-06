"use client";
import type { SelectClientComponentFragment$key } from "@/__generated__/SelectClientComponentFragment.graphql";
import type { pageSelectQuery } from "@/__generated__/pageSelectQuery.graphql";
import SelectView from "@/components/select/SelectView";
import SelectViewSkeleton from "@/components/select/SelectViewSkeleton";
import { Suspense } from "react";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import { SelectPageQuery } from "./page";

const SelectClientComponentFragment = graphql`
  fragment SelectClientComponentFragment on Query {
    ...SelectViewFragment
  }
`;

export default function SelectClientComponent({
	queryReference,
}: {
	queryReference: PreloadedQuery<pageSelectQuery>;
}) {
	const data = usePreloadedQuery(SelectPageQuery, queryReference);
	const query = useFragment<SelectClientComponentFragment$key>(
		SelectClientComponentFragment,
		data,
	);
	return (
		<Suspense fallback={<SelectViewSkeleton />}>
			<SelectView query={query} />
		</Suspense>
	);
}
