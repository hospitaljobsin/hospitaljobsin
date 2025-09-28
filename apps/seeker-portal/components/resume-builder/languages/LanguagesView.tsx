'use client';
import type { LanguagesClientComponentQuery as LanguagesClientComponentQueryType } from '@/__generated__/LanguagesClientComponentQuery.graphql';
import LanguagesClientComponentQuery from '@/__generated__/LanguagesClientComponentQuery.graphql';
import type { LanguagesViewFragment$key } from '@/__generated__/LanguagesViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../../layout/DashboardHeader';
import { ResponsiveResumeBuilder } from '../ResponsiveResumeBuilder';
import ResumeProgress from '../ResumeProgress';
import { DesktopLanguagesView } from './DesktopLanguagesView';
import { MobileLanguagesView } from './MobileLanguagesView';

const LanguagesViewFragment = graphql`
  fragment LanguagesViewFragment on Query {
    ...DashboardHeaderFragment
	...ResumeProgressFragment
    ...DesktopLanguagesViewFragment
	...MobileLanguagesViewFragment
  }
`;

export default function LanguagesView({ queryReference }: { queryReference: PreloadedQuery<LanguagesClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(LanguagesClientComponentQuery, queryReference);
	const data = useFragment<LanguagesViewFragment$key>(LanguagesViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResumeProgress query={data} />
			<ResponsiveResumeBuilder
				desktopComponent={() => <DesktopLanguagesView data={data} />}
				mobileComponent={() => <MobileLanguagesView data={data} />}
			/>
		</div>
	);
}
