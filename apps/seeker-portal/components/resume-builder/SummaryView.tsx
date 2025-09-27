'use client';
import type { SummaryClientComponentQuery as SummaryClientComponentQueryType } from '@/__generated__/SummaryClientComponentQuery.graphql';
import SummaryClientComponentQuery from '@/__generated__/SummaryClientComponentQuery.graphql';
import type { SummaryViewFragment$key } from '@/__generated__/SummaryViewFragment.graphql';
import React from 'react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../layout/DashboardHeader';
import { MobileSummaryView } from './mobile/MobileSummaryView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const SummaryViewFragment = graphql`
  fragment SummaryViewFragment on Query {
    ...DashboardHeaderFragment
  }
`;

const DesktopSummaryView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Summary</h1>;
};

export default function SummaryView({ queryReference }: { queryReference: PreloadedQuery<SummaryClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(SummaryClientComponentQuery, queryReference);
	const data = useFragment<SummaryViewFragment$key>(SummaryViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResponsiveResumeBuilder desktopComponent={DesktopSummaryView} mobileComponent={MobileSummaryView} />
		</div>
	);
}
