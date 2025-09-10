/* eslint-disable relay/must-colocate-fragment-spreads */
'use client';
import type { OrganizationMembersTabFragment$key } from '@/__generated__/OrganizationMembersTabFragment.graphql';
import dynamic from 'next/dynamic';
import { graphql, useFragment } from 'react-relay';
import OrganizationMembersList from './OrganizationMembersList';

const OrgDetailHeaderClientComponent = dynamic(() => import('@/components/layout/OrgDetailHeaderClientComponent'), { ssr: false });

const OrganizationMembersTabFragment = graphql`
 fragment OrganizationMembersTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...OrganizationMembersListFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationMembersTab(props: { rootQuery: OrganizationMembersTabFragment$key; slug: string }) {
	const query = useFragment(OrganizationMembersTabFragment, props.rootQuery);

	return (
		<div className='w-full flex flex-col flex-1'>
			<OrgDetailHeaderClientComponent slug={props.slug} />
			<div className='w-full mx-auto bg-background-600'>
				<div className='w-full px-5 max-w-7xl mx-auto'>
					<div className='py-8 w-full h-full flex flex-col items-center gap-12'>
						<OrganizationMembersList rootQuery={query} />
					</div>
				</div>
			</div>
		</div>
	);
}
