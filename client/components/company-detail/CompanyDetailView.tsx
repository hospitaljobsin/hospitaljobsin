import { graphql, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { CompanyDetailViewQuery as CompanyDetailViewQueryType } from "./__generated__/CompanyDetailViewQuery.graphql";
import CompanyDetails from "./CompanyDetails";

const CompanyDetailViewQuery = graphql`
  query CompanyDetailViewQuery($companyId: ID!) {
    node(id: $companyId) {
      __typename
      ... on Company {
        ...CompanyDetailsFragment
      }
    }
  }
`;

export default function CompanyDetailView(props: {
  queryRef: PreloadedQuery<CompanyDetailViewQueryType>;
}) {
  const data = usePreloadedQuery(CompanyDetailViewQuery, props.queryRef);

  if (!data.node || data.node.__typename !== "Company") {
    return null;
  }

  return (
    <div className="py-8 w-full h-full max-w-5xl mx-auto flex flex-col items-center gap-6">
      <CompanyDetails company={data.node} />
    </div>
  );
}
