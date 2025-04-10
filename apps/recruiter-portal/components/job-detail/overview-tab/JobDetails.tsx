import type { JobDetailsFragment$key } from "@/__generated__/JobDetailsFragment.graphql";
import type { JobDetailsInternalFragment$key as JobDetailsInternalFragmentType } from "@/__generated__/JobDetailsInternalFragment.graphql";
import links from "@/lib/links";
import { Alert, Button, Link } from "@heroui/react";
import { useParams } from "next/navigation";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import JobControls from "./JobControls";

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        ...JobDetailsInternalFragment
      }
     
    }
  }
`;

const JobDetailsInternalFragment = graphql`
  fragment JobDetailsInternalFragment on Job {
    title
    description
    applicationForm {
      __typename
    }
    organization {
      isAdmin
    }
	...JobControlsFragment
  }
`;

export default function JobDetails({
	rootQuery,
}: { rootQuery: JobDetailsFragment$key }) {
	const params = useParams<{ slug: string; jobSlug: string }>();
	const root = useFragment(JobDetailsFragment, rootQuery);
	invariant(root.job.__typename === "Job", "Expected 'Job' node type");
	const data = useFragment<JobDetailsInternalFragmentType>(
		JobDetailsInternalFragment,
		root.job,
	);

	const hasApplicationForm = data.applicationForm !== null;

	return (
		<div className="w-full flex flex-col gap-6">
			{!hasApplicationForm && data.organization?.isAdmin ? (
				<Alert
					color="warning"
					title="You need to set up an application form before publishing this job"
					variant="flat"
					endContent={
						<Button
							variant="flat"
							color="warning"
							as={Link}
							href={links.jobDetailApplicationForm(params.slug, params.jobSlug)}
						>
							Set up application form
						</Button>
					}
				/>
			) : null}
			{hasApplicationForm && data.organization?.isAdmin ? (
				<JobControls job={data} />
			) : null}
		</div>
	);
}
