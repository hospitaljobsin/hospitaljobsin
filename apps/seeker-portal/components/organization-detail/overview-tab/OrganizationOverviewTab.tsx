/* eslint-disable relay/must-colocate-fragment-spreads */
'use client';
import dynamic from 'next/dynamic';
import { graphql, useFragment } from 'react-relay';
import type { OrganizationOverviewTabFragment$key } from '@/__generated__/OrganizationOverviewTabFragment.graphql';
import DashboardHeaderSkeleton from '@/components/layout/DashboardHeaderSkeleton';
import OrganizationDetails from './OrganizationDetails';
import OrganizationJobsListSkeleton from './OrganizationJobsListSkeleton';

const DashboardHeaderClientComponent = dynamic(() => import('@/components/layout/DashboardHeaderClientComponent'), {
	ssr: false,
	loading: () => <DashboardHeaderSkeleton />
});

const OrganizationJobsListClientComponent = dynamic(() => import('./OrganizationJobsListClientComponent'), {
	ssr: false,
	loading: () => <OrganizationJobsListSkeleton />
});

const OrganizationOverviewTabFragment = graphql`
 fragment OrganizationOverviewTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...OrganizationDetailsFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationOverviewTab(props: { rootQuery: OrganizationOverviewTabFragment$key; slug: string }) {
	const query = useFragment(OrganizationOverviewTabFragment, props.rootQuery);

	return (
		<div className='w-full flex flex-col flex-1'>
			<DashboardHeaderClientComponent />
			<div className='w-full mx-auto bg-background-600'>
				<div className='w-full px-5 max-w-7xl mx-auto'>
					<div className='py-8 w-full h-full flex flex-col items-center gap-12'>
						<OrganizationDetails rootQuery={query} />
						<OrganizationJobsListClientComponent slug={props.slug} />
					</div>
				</div>
			</div>
		</div>
	);
}
