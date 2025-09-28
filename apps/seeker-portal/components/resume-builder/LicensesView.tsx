'use client';
import type { LicensesClientComponentQuery as LicensesClientComponentQueryType } from '@/__generated__/LicensesClientComponentQuery.graphql';
import LicensesClientComponentQuery from '@/__generated__/LicensesClientComponentQuery.graphql';
import type { LicensesViewFragment$key } from '@/__generated__/LicensesViewFragment.graphql';
import React from 'react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../layout/DashboardHeader';
import { MobileLicensesView } from './mobile/MobileLicensesView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const LicensesViewFragment = graphql`
  fragment LicensesViewFragment on Query {
    ...DashboardHeaderFragment
  }
`;

const DesktopLicensesView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Licenses</h1>;
};

export default function LicensesView({ queryReference }: { queryReference: PreloadedQuery<LicensesClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(LicensesClientComponentQuery, queryReference);
	const data = useFragment<LicensesViewFragment$key>(LicensesViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResponsiveResumeBuilder desktopComponent={DesktopLicensesView} mobileComponent={MobileLicensesView} />
		</div>
	);
}
