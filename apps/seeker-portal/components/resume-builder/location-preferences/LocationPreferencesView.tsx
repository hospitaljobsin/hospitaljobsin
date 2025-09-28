'use client';
import type { LocationPreferencesClientComponentQuery as LocationPreferencesClientComponentQueryType } from '@/__generated__/LocationPreferencesClientComponentQuery.graphql';
import LocationPreferencesClientComponentQuery from '@/__generated__/LocationPreferencesClientComponentQuery.graphql';
import type { LocationPreferencesViewFragment$key } from '@/__generated__/LocationPreferencesViewFragment.graphql';
import React from 'react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../../layout/DashboardHeader';
import { MobileLocationPreferencesView } from './MobileLocationPreferencesView';
import { ResponsiveResumeBuilder } from '../ResponsiveResumeBuilder';

const LocationPreferencesViewFragment = graphql`
  fragment LocationPreferencesViewFragment on Query {
    ...DashboardHeaderFragment
  }
`;

const DesktopLocationPreferencesView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Location Preferences</h1>;
};

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
			<ResponsiveResumeBuilder desktopComponent={DesktopLocationPreferencesView} mobileComponent={MobileLocationPreferencesView} />
		</div>
	);
}
