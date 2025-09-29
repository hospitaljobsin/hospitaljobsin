'use client';
import type { DesktopCareerProfileViewFragment$key } from '@/__generated__/DesktopCareerProfileViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateCareerProfileForm from './UpdateCareerProfileForm';

const DesktopCareerProfileViewFragment = graphql`
  fragment DesktopCareerProfileViewFragment on Query {
    viewer {
        __typename
      ... on Account {
        profile @required(action: THROW) {
          ...UpdateCareerProfileFormFragment
        }
      }
    }
  }
`;

export const DesktopCareerProfileView: React.FC<{ data: DesktopCareerProfileViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(DesktopCareerProfileViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');

	return <UpdateCareerProfileForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
