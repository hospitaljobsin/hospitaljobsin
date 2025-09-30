import type { MobileIntroductionViewFragment$key } from '@/__generated__/MobileIntroductionViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdatePersonalDetailsForm from './UpdateIntroductionForm';

const MobileIntroductionViewFragment = graphql`
  fragment MobileIntroductionViewFragment on Query {
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

export const MobileIntroductionView: React.FC<{ data: MobileIntroductionViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(MobileIntroductionViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');

	return <UpdatePersonalDetailsForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
