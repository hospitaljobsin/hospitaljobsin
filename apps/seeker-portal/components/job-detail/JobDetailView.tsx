import type { JobDetailViewFragment$key } from "@/__generated__/JobDetailViewFragment.graphql";
import { env } from "@/lib/env";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { graphql, useFragment } from "react-relay";
import JobDetails from "./JobDetails";

const JobDetailViewFragment = graphql`
 fragment JobDetailViewFragment on Query @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) {
		...JobDetailsFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

export default function JobDetailView(props: {
	rootQuery: JobDetailViewFragment$key;
}) {
	const slug = useParams<{ slug: string }>().slug;
	const query = useFragment(JobDetailViewFragment, props.rootQuery);

	useEffect(() => {
		if (slug) {
			// register a user view for the job
			fetch(`${env.NEXT_PUBLIC_API_URL}/jobs/${slug}/view`, { method: "POST" });
		}
	}, [slug]);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-6">
			<JobDetails rootQuery={query} />
		</div>
	);
}
