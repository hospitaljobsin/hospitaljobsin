import type { MobileCareerProfileViewFragment$key } from '@/__generated__/MobileCareerProfileViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateCareerProfileForm from './UpdateCareerProfileForm';

const MobileCareerProfileViewFragment = graphql`
  fragment MobileCareerProfileViewFragment on Query {
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

export const MobileCareerProfileView: React.FC<{ data: MobileCareerProfileViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(MobileCareerProfileViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');

	return <UpdateCareerProfileForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
