'use client';
import type { LocationPreferencesClientComponentQuery as LocationPreferencesClientComponentQueryType } from '@/__generated__/LocationPreferencesClientComponentQuery.graphql';
import LocationPreferencesClientComponentQuery from '@/__generated__/LocationPreferencesClientComponentQuery.graphql';
import type { LocationPreferencesViewFragment$key } from '@/__generated__/LocationPreferencesViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../../layout/DashboardHeader';
import { ResponsiveResumeBuilder } from '../ResponsiveResumeBuilder';
import ResumeProgress from '../ResumeProgress';
import { DesktopLocationPreferencesView } from './DesktopLocationPreferencesView';
import { MobileLocationPreferencesView } from './MobileLocationPreferencesView';

const LocationPreferencesViewFragment = graphql`
  fragment LocationPreferencesViewFragment on Query {
    ...DashboardHeaderFragment
	...ResumeProgressFragment
    ...DesktopLocationPreferencesViewFragment
	...MobileLocationPreferencesViewFragment
  }
`;

export default function LocationPreferencesView({
	queryReference
}: {
	queryReference: PreloadedQuery<LocationPreferencesClientComponentQueryType>;
}) {
	const rootData = usePreloadedQuery(LocationPreferencesClientComponentQuery, queryReference);
	const data = useFragment<LocationPreferencesViewFragment$key>(LocationPreferencesViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResumeProgress query={data} />
			<ResponsiveResumeBuilder
				desktopComponent={() => <DesktopLocationPreferencesView data={data} />}
				mobileComponent={() => <MobileLocationPreferencesView data={data} />}
			/>
		</div>
	);
}
