import type { MobileResumeViewFragment$key } from '@/__generated__/MobileResumeViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateCareerProfileForm from './UpdateResumeForm';

const MobileResumeViewFragment = graphql`
  fragment MobileResumeViewFragment on Query {
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

export const MobileResumeView: React.FC<{ data: MobileResumeViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(MobileResumeViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');

	return <UpdateCareerProfileForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
