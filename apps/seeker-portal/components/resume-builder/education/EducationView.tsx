'use client';
import type { EducationClientComponentQuery as EducationClientComponentQueryType } from '@/__generated__/EducationClientComponentQuery.graphql';
import EducationClientComponentQuery from '@/__generated__/EducationClientComponentQuery.graphql';
import type { EducationViewFragment$key } from '@/__generated__/EducationViewFragment.graphql';
import React from 'react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../../layout/DashboardHeader';
import { MobileEducationView } from './MobileEducationView';
import { ResponsiveResumeBuilder } from '../ResponsiveResumeBuilder';

const EducationViewFragment = graphql`
  fragment EducationViewFragment on Query {
    ...DashboardHeaderFragment
  }
`;

const DesktopEducationView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Education</h1>;
};

export default function EducationView({ queryReference }: { queryReference: PreloadedQuery<EducationClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(EducationClientComponentQuery, queryReference);
	const data = useFragment<EducationViewFragment$key>(EducationViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResponsiveResumeBuilder desktopComponent={DesktopEducationView} mobileComponent={MobileEducationView} />
		</div>
	);
}
