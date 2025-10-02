'use client';
import { Suspense } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { LandingHeaderClientComponentQuery as LandingHeaderClientComponentQueryType } from '@/__generated__/LandingHeaderClientComponentQuery.graphql';
import LandingHeader from './LandingHeader';
import LandingHeaderSkeleton from './LandingHeaderSkeleton';

export const LandingHeaderClientComponentQuery = graphql`
  query LandingHeaderClientComponentQuery {
    ...LandingHeaderFragment
  }
`;

export default function LandingHeaderClientComponent() {
	const data = useLazyLoadQuery<LandingHeaderClientComponentQueryType>(
		LandingHeaderClientComponentQuery,
		{},
		{
			fetchPolicy: 'store-or-network'
		}
	);

	return (
		<Suspense fallback={<LandingHeaderSkeleton />}>
			<LandingHeader rootQuery={data} />
		</Suspense>
	);
}
