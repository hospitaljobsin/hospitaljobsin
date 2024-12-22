"use client";
import type { PreloadedQuery } from "react-relay";
import { graphql, usePreloadedQuery } from "react-relay";
import CompanyDetails from "./CompanyDetails";
import CompanyJobsList from "./CompanyJobsList";
import type { CompanyDetailViewQuery as CompanyDetailViewQueryType } from "./__generated__/CompanyDetailViewQuery.graphql";


const CompanyDetailViewQuery = graphql`
  query CompanyDetailViewQuery($slug: String!) {
    ...CompanyDetailsFragment @arguments(slug: $slug)
	...CompanyJobsListFragment @arguments(slug: $slug)
  }
`;

export default function CompanyDetailView(props: {
	queryRef: PreloadedQuery<CompanyDetailViewQueryType>;
}) {
	const data = usePreloadedQuery(CompanyDetailViewQuery, props.queryRef);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<CompanyDetails rootQuery={data} />
			<CompanyJobsList rootQuery={data} />
		</div>
	);
}
