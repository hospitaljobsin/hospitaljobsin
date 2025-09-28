'use client';
import type { PersonalInfoClientComponentQuery as PersonalInfoClientComponentQueryType } from '@/__generated__/PersonalInfoClientComponentQuery.graphql';
import PersonalInfoClientComponentQuery from '@/__generated__/PersonalInfoClientComponentQuery.graphql';
import type { PersonalInfoViewFragment$key } from '@/__generated__/PersonalInfoViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../../layout/DashboardHeader';
import { ResponsiveResumeBuilder } from '../ResponsiveResumeBuilder';
import ResumeProgress from '../ResumeProgress';
import { DesktopPersonalInfoView } from './DesktopPersonalInfoView';
import { MobilePersonalInfoView } from './MobilePersonalInfoView';

const PersonalInfoViewFragment = graphql`
  fragment PersonalInfoViewFragment on Query {
    ...DashboardHeaderFragment
	...ResumeProgressFragment
    ...DesktopPersonalInfoViewFragment
	...MobilePersonalInfoViewFragment
  }
`;

export default function PersonalInfoView({ queryReference }: { queryReference: PreloadedQuery<PersonalInfoClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(PersonalInfoClientComponentQuery, queryReference);
	const data = useFragment<PersonalInfoViewFragment$key>(PersonalInfoViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResumeProgress query={data} />
			<ResponsiveResumeBuilder
				desktopComponent={() => <DesktopPersonalInfoView data={data} />}
				mobileComponent={() => <MobilePersonalInfoView data={data} />}
			/>
		</div>
	);
}
