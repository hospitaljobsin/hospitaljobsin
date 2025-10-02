import { graphql } from 'relay-runtime';
import type LandingPageQueryNode from '@/__generated__/pageLandingQuery.graphql';
import type { pageLandingQuery } from '@/__generated__/pageLandingQuery.graphql';
import type SiteStatsPageQueryNode from '@/__generated__/pageSiteStatsQuery.graphql';
import type { pageSiteStatsQuery } from '@/__generated__/pageSiteStatsQuery.graphql';
import LandingView from '@/components/landing/LandingView';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';

const LandingPageQuery = graphql`
query pageLandingQuery {
	...JobListFragment
}
`;

const SiteStatsQuery = graphql`
query pageSiteStatsQuery {
		...SiteStatsFragment
	}
`;

export default async function LandingPage() {
	const dataPromise = loadSerializableQuery<typeof LandingPageQueryNode, pageLandingQuery>(
		LandingPageQuery,
		{},
		{
			metadata: {
				options: {
					next: {
						revalidate: 60 * 60, // revalidate this after 60 minutes
						tags: ['latest-jobs']
					}
				}
			}
		}
	);

	const siteStatsDataPromise = loadSerializableQuery<typeof SiteStatsPageQueryNode, pageSiteStatsQuery>(
		SiteStatsQuery,
		{},
		{
			metadata: {
				options: {
					next: {
						revalidate: 60 * 60 * 24, // revalidate this after 1 day
						tags: ['site-stats']
					}
				}
			}
		}
	);

	const [data, siteStatsData] = await Promise.all([dataPromise, siteStatsDataPromise]);
	return <LandingView jobsData={data} siteStatsData={siteStatsData.data} />;
}
