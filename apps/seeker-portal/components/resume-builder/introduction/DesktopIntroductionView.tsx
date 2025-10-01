'use client';
import type { DesktopIntroductionViewFragment$key } from '@/__generated__/DesktopIntroductionViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdatePersonalDetailsForm from './UpdateIntroductionForm';

const DesktopIntroductionViewFragment = graphql`
  fragment DesktopIntroductionViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile @required(action: THROW) {
          ...UpdateIntroductionFormFragment
        }
      }
    }
  }
`;

export const DesktopIntroductionView: React.FC<{ data: DesktopIntroductionViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(DesktopIntroductionViewFragment, data);

	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');

	return <UpdatePersonalDetailsForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
