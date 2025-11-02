import { graphql } from 'relay-runtime';
import type SiteStatsPageQueryNode from '@/__generated__/pageSiteStatsQuery.graphql';
import type { pageSiteStatsQuery } from '@/__generated__/pageSiteStatsQuery.graphql';
import LandingView from '@/components/landing/LandingView';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';

const SiteStatsQuery = graphql`
query pageSiteStatsQuery {
		...SiteStatsFragment
	}
`;

export default async function LandingPage() {
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

	const [siteStatsData] = await Promise.all([siteStatsDataPromise]);
	return <LandingView siteStatsData={siteStatsData.data} />;
}
