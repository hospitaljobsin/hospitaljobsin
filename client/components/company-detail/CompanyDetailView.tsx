import type { PreloadedQuery } from "react-relay";
import { graphql, usePreloadedQuery } from "react-relay";
import CompanyDetails from "./CompanyDetails";
import CompanyJobsList from "./CompanyJobsList";
import type { CompanyDetailViewQuery as CompanyDetailViewQueryType } from "./__generated__/CompanyDetailViewQuery.graphql";

const CompanyDetailViewQuery = graphql`
  query CompanyDetailViewQuery($slug: String!) {
    company(slug: $slug) {
      __typename
      ... on Company {
        ...CompanyJobsListFragment
        ...CompanyDetailsFragment
      }
    }
  }
`;

export default function CompanyDetailView(props: {
	queryRef: PreloadedQuery<CompanyDetailViewQueryType>;
}) {
	const data = usePreloadedQuery(CompanyDetailViewQuery, props.queryRef);

	if (data.company.__typename !== "Company") {
		return null;
	}

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<CompanyDetails company={data.company} />
			<CompanyJobsList rootQuery={data.company} />
		</div>
	);
}
