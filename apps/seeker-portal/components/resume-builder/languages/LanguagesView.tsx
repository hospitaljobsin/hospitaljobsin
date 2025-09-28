'use client';
import type { LanguagesClientComponentQuery as LanguagesClientComponentQueryType } from '@/__generated__/LanguagesClientComponentQuery.graphql';
import LanguagesClientComponentQuery from '@/__generated__/LanguagesClientComponentQuery.graphql';
import type { LanguagesViewFragment$key } from '@/__generated__/LanguagesViewFragment.graphql';
import React from 'react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../../layout/DashboardHeader';
import { MobileLanguagesView } from './MobileLanguagesView';
import { ResponsiveResumeBuilder } from '../ResponsiveResumeBuilder';

const LanguagesViewFragment = graphql`
  fragment LanguagesViewFragment on Query {
    ...DashboardHeaderFragment
  }
`;

const DesktopLanguagesView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Languages</h1>;
};

export default function LanguagesView({ queryReference }: { queryReference: PreloadedQuery<LanguagesClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(LanguagesClientComponentQuery, queryReference);
	const data = useFragment<LanguagesViewFragment$key>(LanguagesViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResponsiveResumeBuilder desktopComponent={DesktopLanguagesView} mobileComponent={MobileLanguagesView} />
		</div>
	);
}
