'use client';
import type { DesktopPersonalInfoViewFragment$key } from '@/__generated__/DesktopPersonalInfoViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdatePersonalDetailsForm from './UpdatePersonalDetailsForm';

const DesktopPersonalInfoViewFragment = graphql`
  fragment DesktopPersonalInfoViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile {
          ...UpdatePersonalDetailsFormFragment
        }
      }
    }
  }
`;

export const DesktopPersonalInfoView: React.FC<{ data: DesktopPersonalInfoViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(DesktopPersonalInfoViewFragment, data);

	invariant(fragmentData.viewer.__typename === 'Account' && fragmentData.viewer.profile, 'Expected profile data to be present');

	return <UpdatePersonalDetailsForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
