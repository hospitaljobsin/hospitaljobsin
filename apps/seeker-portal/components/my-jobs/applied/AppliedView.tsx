"use client";
import type { AppliedViewQuery as AppliedViewQueryType } from "@/__generated__/AppliedViewQuery.graphql";
import { graphql, useLazyLoadQuery } from "react-relay";
import AppliedJobsList from "./AppliedJobsList";

const AppliedViewQuery = graphql`
  query AppliedViewQuery {
    ...AppliedJobsListFragment
  }
`;

export default function AppliedView() {
	const data = useLazyLoadQuery<AppliedViewQueryType>(
		AppliedViewQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<>
			<AppliedJobsList rootQuery={data} />
		</>
	);
}
