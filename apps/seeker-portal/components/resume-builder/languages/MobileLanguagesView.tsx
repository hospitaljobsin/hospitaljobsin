import type { MobileLanguagesViewFragment$key } from '@/__generated__/MobileLanguagesViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateLanguagesForm from './UpdateLanguagesForm';

const MobileLanguagesViewFragment = graphql`
  fragment MobileLanguagesViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile {
          ...UpdateLanguagesFormFragment
        }
      }
    }
  }
`;

export const MobileLanguagesView: React.FC<{ data: MobileLanguagesViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(MobileLanguagesViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account' && fragmentData.viewer.profile, 'Expected profile data to be present');

	return <UpdateLanguagesForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
