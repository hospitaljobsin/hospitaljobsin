'use client';
import type { JobDetailViewClientComponentFragment$key } from '@/__generated__/JobDetailViewClientComponentFragment.graphql';
import type JobDetailViewQueryNode from '@/__generated__/pageJobDetailViewQuery.graphql';
import type { pageJobDetailViewQuery } from '@/__generated__/pageJobDetailViewQuery.graphql';
import PageJobDetailViewQuery from '@/__generated__/pageJobDetailViewQuery.graphql';
import type { pageTrendingJobsQuery } from '@/__generated__/pageTrendingJobsQuery.graphql';
import TrendingJobsQueryNode from '@/__generated__/pageTrendingJobsQuery.graphql';
import JobDetailView from '@/components/job-detail/JobDetailView';
import type { SerializablePreloadedQuery } from '@/lib/relay/serializablePreloadedQuery';
import useSerializablePreloadedQuery from '@/lib/relay/useSerializablePreloadedQuery';
import { graphql, useFragment, usePreloadedQuery, useRelayEnvironment } from 'react-relay';

const JobDetailViewClientComponentFragment = graphql`
 fragment JobDetailViewClientComponentFragment on Query @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
	) {
		...JobDetailViewFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

export default function JobDetailViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<typeof JobDetailViewQueryNode, pageJobDetailViewQuery>;
	preloadedTrendingQuery: SerializablePreloadedQuery<typeof TrendingJobsQueryNode, pageTrendingJobsQuery>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<typeof JobDetailViewQueryNode, pageJobDetailViewQuery>(
		environment,
		props.preloadedQuery,
		'store-or-network'
	);

	const trendingQueryRef = useSerializablePreloadedQuery<typeof TrendingJobsQueryNode, pageTrendingJobsQuery>(
		environment,
		props.preloadedTrendingQuery,
		'store-or-network'
	);

	const trendingData = usePreloadedQuery(TrendingJobsQueryNode, trendingQueryRef);

	const data = usePreloadedQuery(PageJobDetailViewQuery, queryRef);

	const rootQuery = useFragment<JobDetailViewClientComponentFragment$key>(JobDetailViewClientComponentFragment, data);

	return <JobDetailView rootQuery={rootQuery} trendingData={trendingData} />;
}
