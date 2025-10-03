'use client';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';
import type { StickyJobApplyButtonQuery as StickyJobApplyButtonQueryType } from '@/__generated__/StickyJobApplyButtonQuery.graphql';
import JobApplyButton from './job-apply/JobApplyButton';

const StickyJobApplyButtonQuery = graphql`
  query StickyJobApplyButtonQuery($slug: String!, $jobSlug: String!) {
	...JobApplyButtonFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

export default function StickyJobApplyButton({ slug, jobSlug }: { slug: string; jobSlug: string }) {
	const data = useLazyLoadQuery<StickyJobApplyButtonQueryType>(StickyJobApplyButtonQuery, {
		slug,
		jobSlug
	});

	return <JobApplyButton query={data} sticky />;
}
