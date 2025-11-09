'use client';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { DashboardHeaderClientComponentQuery as DashboardHeaderClientComponentQueryType } from '@/__generated__/DashboardHeaderClientComponentQuery.graphql';
import DashboardHeader from './DashboardHeader';

export const DashboardHeaderClientComponentQuery = graphql`
  query DashboardHeaderClientComponentQuery {
    ...DashboardHeaderFragment
  }
`;

export default function DashboardHeaderClientComponent({ animate = true }: { animate?: boolean }) {
	const data = useLazyLoadQuery<DashboardHeaderClientComponentQueryType>(
		DashboardHeaderClientComponentQuery,
		{},
		{
			fetchPolicy: 'store-or-network',
			networkCacheConfig: {
				metadata: {
					includeAuth: true
				}
			}
		}
	);

	return <DashboardHeader query={data} animate={animate} />;
}
