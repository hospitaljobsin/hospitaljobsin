'use client';

import { useRouter } from '@bprogress/next/app';
import { addToast } from '@heroui/react';
import { useCallback } from 'react';
import { graphql, useMutation } from 'react-relay';
import type { useJobApplicationMutation } from '@/__generated__/useJobApplicationMutation.graphql';
import links from '@/lib/links';

const CreateJobApplicationMutation = graphql`
  mutation useJobApplicationMutation($jobId: ID!, $applicantFields: [ApplicantFieldInput!]!) {
    createJobApplication(jobId: $jobId, applicantFields: $applicantFields) {
      __typename
      ... on CreateJobApplicantSuccess {
        jobApplicant {
          job {
            id
            ...JobDetailsInternalFragment
            isApplied
            slug
            organization {
              slug
            }
          }
        }
      }
      ... on JobNotFoundError {
        __typename
      }
      ... on JobNotPublishedError {
        __typename
      }
      ... on JobApplicantAlreadyExistsError {
        __typename
      }
      ... on JobIsExternalError {
        __typename
      }
      ... on AccountProfileIncompleteError {
        __typename
      }
	  ... on InvalidApplicantFieldsError {
		__typename
	  }
    }
  }
`;

export interface ApplicationField {
	fieldName: string;
	fieldValue: string;
}

export function useJobApplication() {
	const router = useRouter();
	const [commitMutation, isMutationInFlight] = useMutation<useJobApplicationMutation>(CreateJobApplicationMutation);

	const applyForJob = useCallback(
		(jobId: string, applicationFields: ApplicationField[] = []) => {
			return new Promise<boolean>(resolve => {
				commitMutation({
					variables: {
						jobId,
						applicantFields: applicationFields
					},
					onCompleted(response) {
						if (response.createJobApplication.__typename === 'CreateJobApplicantSuccess') {
							const job = response.createJobApplication.jobApplicant.job;
							router.push(links.jobDetail(job.organization.slug, job.slug));
							resolve(true);
						} else {
							addToast({
								description: 'An unexpected error occurred. Please try again.',
								color: 'danger'
							});
							resolve(false);
						}
					},
					onError() {
						addToast({
							description: 'An unexpected error occurred. Please try again.',
							color: 'danger'
						});
						resolve(false);
					}
				});
			});
		},
		[commitMutation, router]
	);

	return {
		applyForJob,
		isLoading: isMutationInFlight
	};
}
