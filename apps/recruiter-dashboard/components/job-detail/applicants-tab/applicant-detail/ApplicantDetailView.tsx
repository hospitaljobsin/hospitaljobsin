"use client";
import type { ApplicantDetailViewFragment$key } from "@/__generated__/ApplicantDetailViewFragment.graphql";
import JobApplicantDetailClientComponentQuery, {
	type JobApplicantDetailClientComponentQuery as JobApplicantDetailClientComponentQueryType,
} from "@/__generated__/JobApplicantDetailClientComponentQuery.graphql";
import ApplicantNotFoundView from "@/components/ApplicantNotFoundView";
import JobNotFoundView from "@/components/JobNotFoundView";
import NotFoundView from "@/components/NotFoundView";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import ApplicantChat from "./ApplicantChat";
import ApplicantDetails from "./ApplicantDetails";
import ProfileSnapshotView from "./ProfileSnapshotView";

const ApplicantDetailViewFragment = graphql`
 fragment ApplicantDetailViewFragment on Query @argumentDefinitions(
    slug: { type: "String!"}
	applicantSlug: { type: "String!"}
    jobSlug: { type: "String!"}
    ) {
        organization(slug: $slug) {
            __typename
            ... on Organization {
                job(slug: $jobSlug) {
                    __typename
                    ... on Job {
						slug
                        ...ApplicantDetails_job
                        jobApplicant(slug: $applicantSlug) {
                            __typename
                            ... on JobApplicant {
                                ...ApplicantDetailsFragment
								...ApplicantChatFragment
                                ...ProfileSnapshotViewFragment
                            }
                        }
                    }
                }
            }
        }

  }
`;

export default function ApplicantDetailView(props: {
	initialQueryRef: PreloadedQuery<JobApplicantDetailClientComponentQueryType>;
}) {
	const data = usePreloadedQuery(
		JobApplicantDetailClientComponentQuery,
		props.initialQueryRef,
	);
	const query = useFragment<ApplicantDetailViewFragment$key>(
		ApplicantDetailViewFragment,
		data,
	);

	if (query.organization.__typename !== "Organization") {
		return <NotFoundView />;
	}

	if (query.organization.job.__typename !== "Job") {
		return <JobNotFoundView />;
	}

	if (query.organization.job.jobApplicant.__typename !== "JobApplicant") {
		return <ApplicantNotFoundView slug={query.organization.job.slug} />;
	}

	return (
		<div className="flex flex-row h-full">
			<div className="pl-6 py-6 w-full h-full flex flex-col items-start gap-12 overflow-y-auto pr-6">
				<ApplicantDetails
					job={query.organization.job}
					rootQuery={query.organization.job.jobApplicant}
				/>
				<ProfileSnapshotView
					jobApplicant={query.organization.job.jobApplicant}
				/>
			</div>
			<ApplicantChat applicant={query.organization.job.jobApplicant} />
		</div>
	);
}
