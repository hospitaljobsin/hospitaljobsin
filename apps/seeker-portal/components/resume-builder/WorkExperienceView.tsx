'use client';
import type { WorkExperienceClientComponentQuery as WorkExperienceClientComponentQueryType } from '@/__generated__/WorkExperienceClientComponentQuery.graphql';
import WorkExperienceClientComponentQuery from '@/__generated__/WorkExperienceClientComponentQuery.graphql';
import type { WorkExperienceViewFragment$key } from '@/__generated__/WorkExperienceViewFragment.graphql';
import React from 'react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../layout/DashboardHeader';
import { MobileWorkExperienceView } from './mobile/MobileWorkExperienceView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const WorkExperienceViewFragment = graphql`
  fragment WorkExperienceViewFragment on Query {
    ...DashboardHeaderFragment
  }
`;

const DesktopWorkExperienceView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Work Experience</h1>;
};

export default function WorkExperienceView({ queryReference }: { queryReference: PreloadedQuery<WorkExperienceClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(WorkExperienceClientComponentQuery, queryReference);
	const data = useFragment<WorkExperienceViewFragment$key>(WorkExperienceViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResponsiveResumeBuilder desktopComponent={DesktopWorkExperienceView} mobileComponent={MobileWorkExperienceView} />
		</div>
	);
}
