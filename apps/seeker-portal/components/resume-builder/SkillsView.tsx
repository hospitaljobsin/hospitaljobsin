'use client';
import type { SkillsClientComponentQuery as SkillsClientComponentQueryType } from '@/__generated__/SkillsClientComponentQuery.graphql';
import SkillsClientComponentQuery from '@/__generated__/SkillsClientComponentQuery.graphql';
import type { SkillsViewFragment$key } from '@/__generated__/SkillsViewFragment.graphql';
import React from 'react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../layout/DashboardHeader';
import { MobileSkillsView } from './mobile/MobileSkillsView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const SkillsViewFragment = graphql`
  fragment SkillsViewFragment on Query {
    ...DashboardHeaderFragment
  }
`;

const DesktopSkillsView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Skills</h1>;
};

export default function SkillsView({ queryReference }: { queryReference: PreloadedQuery<SkillsClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(SkillsClientComponentQuery, queryReference);
	const data = useFragment<SkillsViewFragment$key>(SkillsViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResponsiveResumeBuilder desktopComponent={DesktopSkillsView} mobileComponent={MobileSkillsView} />
		</div>
	);
}
