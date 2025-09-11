'use client';
import type { JobControlsClientComponentQuery as JobControlsClientComponentQueryType } from '@/__generated__/JobControlsClientComponentQuery.graphql';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';
import JobControls from './JobControls';

export const JobControlsClientComponentQuery = graphql`
  query JobControlsClientComponentQuery($slug: String!, $jobSlug: String!) {
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
	return <JobControls authQueryRef={data.viewer} job={data.organization.job} />;
}
