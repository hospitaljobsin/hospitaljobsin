/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import { graphql, useFragment } from "react-relay";
import CompanyDetails from "./CompanyDetails";
import CompanyJobsList from "./CompanyJobsList";
import type { CompanyDetailViewFragment$key } from "./__generated__/CompanyDetailViewFragment.graphql";

const CompanyDetailViewFragment = graphql`
 fragment CompanyDetailViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
		...CompanyDetailsFragment @arguments(slug: $slug)
		...CompanyJobsListFragment @arguments(slug: $slug)
  }
`;

export default function CompanyDetailView(props: {
	rootQuery: CompanyDetailViewFragment$key;
}) {
	const query = useFragment(CompanyDetailViewFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<CompanyDetails rootQuery={query} />
			<CompanyJobsList rootQuery={query} />
		</div>
	);
}
