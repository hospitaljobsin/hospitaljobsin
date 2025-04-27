import type { JobDetailViewFragment$key } from "@/__generated__/JobDetailViewFragment.graphql";
import { env } from "@/lib/env/client";
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
	const params = useParams<{ slug: string; jobSlug: string }>();
	const slug = decodeURIComponent(params.slug);
	const jobSlug = decodeURIComponent(params.jobSlug);
	const query = useFragment(JobDetailViewFragment, props.rootQuery);

	useEffect(() => {
		if (slug) {
			// register a user view for the job
			fetch(
				`${env.NEXT_PUBLIC_API_URL}/organizations/${slug}/jobs/${jobSlug}/log_view`,
				{ method: "POST" },
			);
		}
	}, [slug, jobSlug]);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-6">
			<JobDetails rootQuery={query} />
		</div>
	);
}
