import type { MobileEducationViewFragment$key } from '@/__generated__/MobileEducationViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateEducationForm from './UpdateEducationForm';

const MobileEducationViewFragment = graphql`
  fragment MobileEducationViewFragment on Query {
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

export const MobileEducationView: React.FC<{ data: MobileEducationViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(MobileEducationViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account' && fragmentData.viewer.profile, 'Expected profile data to be present');

	return <UpdateEducationForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
