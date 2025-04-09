import { graphql } from "relay-runtime";

const JobDetailViewFragment = graphql`
 fragment JobDetailViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...OrganizationDetailsFragment @arguments(slug: $slug)
  }
`;

export default function JobDetailView() {
	return <div className="w-full h-full flex self-stretch">job detail view</div>;
}
