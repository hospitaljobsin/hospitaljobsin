import type { MobileWorkExperienceViewFragment$key } from '@/__generated__/MobileWorkExperienceViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateWorkExperienceForm from './UpdateWorkExperienceForm';

const MobileWorkExperienceViewFragment = graphql`
  fragment MobileWorkExperienceViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile {
          ...UpdateWorkExperienceFormFragment
        }
      }
    }
  }
`;

export const MobileWorkExperienceView: React.FC<{ data: MobileWorkExperienceViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(MobileWorkExperienceViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account' && fragmentData.viewer.profile, 'Expected profile data to be present');
	return <UpdateWorkExperienceForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
