'use client';
import type { DesktopEducationViewFragment$key } from '@/__generated__/DesktopEducationViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateEducationForm from './UpdateEducationForm';

const DesktopEducationViewFragment = graphql`
  fragment DesktopEducationViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile {
          ...UpdateEducationFormFragment
        }
      }
    }
  }
`;

export const DesktopEducationView: React.FC<{ data: DesktopEducationViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(DesktopEducationViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account' && fragmentData.viewer.profile, 'Expected profile data to be present');
	return <UpdateEducationForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
