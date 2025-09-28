'use client';
import type { DesktopLocationPreferencesViewFragment$key } from '@/__generated__/DesktopLocationPreferencesViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateLocationPreferencesForm from './UpdateLocationPreferencesForm';

const DesktopLocationPreferencesViewFragment = graphql`
  fragment DesktopLocationPreferencesViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile @required(action: THROW) {
          ...UpdateLocationPreferencesFormFragment
        }
      }
    }
  }
`;

export const DesktopLocationPreferencesView: React.FC<{ data: DesktopLocationPreferencesViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(DesktopLocationPreferencesViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');
	return <UpdateLocationPreferencesForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
