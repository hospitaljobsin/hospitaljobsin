'use client';
import type { LocationPreferencesClientComponentQuery as LocationPreferencesClientComponentQueryType } from '@/__generated__/LocationPreferencesClientComponentQuery.graphql';
import LocationPreferencesClientComponentQuery from '@/__generated__/LocationPreferencesClientComponentQuery.graphql';
import type { LocationPreferencesViewFragment$key } from '@/__generated__/LocationPreferencesViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import ResumeBuilderSharedLayout from '../ResumeBuilderSharedLayout';
import { DesktopLocationPreferencesView } from './DesktopLocationPreferencesView';
import { MobileLocationPreferencesView } from './MobileLocationPreferencesView';

const LocationPreferencesViewFragment = graphql`
  fragment LocationPreferencesViewFragment on Query {
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
		<ResumeBuilderSharedLayout
			desktopComponent={() => <DesktopLocationPreferencesView data={data} />}
			mobileComponent={() => <MobileLocationPreferencesView data={data} />}
		/>
	);
}
