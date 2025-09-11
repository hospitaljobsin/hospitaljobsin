'use client';

import type { JobApplyViewClientComponentQuery as JobApplyViewClientComponentQueryType } from '@/__generated__/JobApplyViewClientComponentQuery.graphql';
import JobApplyView from '@/components/job-apply/JobApplyView';
import { graphql, useLazyLoadQuery } from 'react-relay';

const JobApplyViewClientComponentQuery = graphql`
 query JobApplyViewClientComponentQuery ($slug: String!, $jobSlug: String!) {
        ...JobApplyViewFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

export default function JobApplyViewClientComponent(props: { slug: string; jobSlug: string }) {
	const data = useLazyLoadQuery<JobApplyViewClientComponentQueryType>(JobApplyViewClientComponentQuery, {
		slug: props.slug,
		jobSlug: props.jobSlug
	});

	return <JobApplyView rootQuery={data} />;
}
