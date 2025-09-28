'use client';
import type { DesktopWorkExperienceViewFragment$key } from '@/__generated__/DesktopWorkExperienceViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateWorkExperienceForm from './UpdateWorkExperienceForm';

const DesktopWorkExperienceViewFragment = graphql`
  fragment DesktopWorkExperienceViewFragment on Query {
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

export const DesktopWorkExperienceView: React.FC<{ data: DesktopWorkExperienceViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(DesktopWorkExperienceViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account' && fragmentData.viewer.profile, 'Expected profile data to be present');
	return <UpdateWorkExperienceForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
