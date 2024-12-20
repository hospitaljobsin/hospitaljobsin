import type { PreloadedQuery } from "react-relay";
import { graphql, usePreloadedQuery } from "react-relay";
import JobControls from "./JobControls";
import JobDetails from "./JobDetails";
import type { JobDetailViewQuery as JobDetailViewQueryType } from "./__generated__/JobDetailViewQuery.graphql";

const JobDetailViewQuery = graphql`
  query JobDetailViewQuery($slug: String!) {
	viewer {
		__typename
	}
    job(slug: $slug) {
      __typename
      ... on Job {
        ...JobDetailsFragment
        ...JobControlsFragment
      }
    }
  }
`;

export default function JobDetailView(props: {
	queryRef: PreloadedQuery<JobDetailViewQueryType>;
}) {
	const data = usePreloadedQuery(JobDetailViewQuery, props.queryRef);

	if (data.job.__typename !== "Job") {
		return null;
	}

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-6">
			<JobDetails job={data.job}>
				<JobControls
					job={data.job}
					isAuthenticated={data.viewer.__typename === "Account"}
				/>
			</JobDetails>
		</div>
	);
}
