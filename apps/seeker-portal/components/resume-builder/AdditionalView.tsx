'use client';
import type { AdditionalClientComponentQuery as AdditionalClientComponentQueryType } from '@/__generated__/AdditionalClientComponentQuery.graphql';
import AdditionalClientComponentQuery from '@/__generated__/AdditionalClientComponentQuery.graphql';
import type { AdditionalViewFragment$key } from '@/__generated__/AdditionalViewFragment.graphql';
import React from 'react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../layout/DashboardHeader';
import { MobileAdditionalView } from './mobile/MobileAdditionalView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const AdditionalViewFragment = graphql`
  fragment AdditionalViewFragment on Query {
    ...DashboardHeaderFragment
  }
`;

const DesktopAdditionalView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Additional</h1>;
};

export default function AdditionalView({ queryReference }: { queryReference: PreloadedQuery<AdditionalClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(AdditionalClientComponentQuery, queryReference);
	const data = useFragment<AdditionalViewFragment$key>(AdditionalViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResponsiveResumeBuilder desktopComponent={DesktopAdditionalView} mobileComponent={MobileAdditionalView} />
		</div>
	);
}
