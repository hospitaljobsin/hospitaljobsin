import type { MobileLocationPreferencesViewFragment$key } from '@/__generated__/MobileLocationPreferencesViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateLocationPreferencesForm from './UpdateLocationPreferencesForm';

const MobileLocationPreferencesViewFragment = graphql`
  fragment MobileLocationPreferencesViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile {
          ...UpdateLocationPreferencesFormFragment
        }
      }
    }
  }
`;

export const MobileLocationPreferencesView: React.FC<{ data: MobileLocationPreferencesViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(MobileLocationPreferencesViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account' && fragmentData.viewer.profile, 'Expected profile data to be present');
	return <UpdateLocationPreferencesForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
