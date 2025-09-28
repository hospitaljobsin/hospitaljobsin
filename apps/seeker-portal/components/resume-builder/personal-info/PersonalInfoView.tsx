'use client';
import type { PersonalInfoClientComponentQuery as PersonalInfoClientComponentQueryType } from '@/__generated__/PersonalInfoClientComponentQuery.graphql';
import PersonalInfoClientComponentQuery from '@/__generated__/PersonalInfoClientComponentQuery.graphql';
import type { PersonalInfoViewFragment$key } from '@/__generated__/PersonalInfoViewFragment.graphql';
import React from 'react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../../layout/DashboardHeader';
import { MobilePersonalInfoView } from './MobilePersonalInfoView';
import { ResponsiveResumeBuilder } from '../ResponsiveResumeBuilder';

const PersonalInfoViewFragment = graphql`
  fragment PersonalInfoViewFragment on Query {
    ...DashboardHeaderFragment
  }
`;

const DesktopPersonalInfoView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Personal Info</h1>;
};

export default function PersonalInfoView({ queryReference }: { queryReference: PreloadedQuery<PersonalInfoClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(PersonalInfoClientComponentQuery, queryReference);
	const data = useFragment<PersonalInfoViewFragment$key>(PersonalInfoViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResponsiveResumeBuilder desktopComponent={DesktopPersonalInfoView} mobileComponent={MobilePersonalInfoView} />
		</div>
	);
}
