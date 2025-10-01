import type { MobilePersonalInfoViewFragment$key } from '@/__generated__/MobilePersonalInfoViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdatePersonalDetailsForm from './UpdatePersonalDetailsForm';

const MobilePersonalInfoViewFragment = graphql`
  fragment MobilePersonalInfoViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile @required(action: THROW) {
          ...UpdatePersonalDetailsFormFragment
        }
      }
    }
  }
`;

export const MobilePersonalInfoView: React.FC<{ data: MobilePersonalInfoViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(MobilePersonalInfoViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');

	return <UpdatePersonalDetailsForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
