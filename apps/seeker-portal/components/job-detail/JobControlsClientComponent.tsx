'use client';
import type { JobControlsClientComponentQuery as JobControlsClientComponentQueryType } from '@/__generated__/JobControlsClientComponentQuery.graphql';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';
import JobApplyButton from './JobApplyButton';
import JobControls from './JobControls';

export const JobControlsClientComponentQuery = graphql`
  query JobControlsClientComponentQuery($slug: String!, $jobSlug: String!) {
	...JobApplyButtonFragment @arguments(slug: $slug, jobSlug: $jobSlug)
		organization(slug: $slug) {
		__typename
		... on Organization {
			job(slug: $jobSlug) {
				__typename
				... on Job {
					...JobControlsFragment
				}
			}
		}
	}
	viewer {
		__typename
		...JobControlsAuthFragment
		... on Account {
			profile @required(action: THROW) {
				isComplete
			}
		}
	  }
  }
`;

export default function JobControlsClientComponent({ slug, jobSlug }: { slug: string; jobSlug: string }) {
	const data = useLazyLoadQuery<JobControlsClientComponentQueryType>(JobControlsClientComponentQuery, {
		slug,
		jobSlug
	});

	invariant(data.organization.__typename === 'Organization', "Expected 'Organization' node type");

	invariant(data.organization.job.__typename === 'Job', "Expected 'Job' node type");
	return (
		<div className='w-full sm:w-auto flex flex-col-reverse sm:flex-row justify-end gap-6 sm:items-center'>
			<JobControls authQueryRef={data.viewer} job={data.organization.job} />
			<JobApplyButton query={data} />
		</div>
	);
}
