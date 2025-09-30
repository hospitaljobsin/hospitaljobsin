'use client';
import type { DesktopResumeViewFragment$key } from '@/__generated__/DesktopResumeViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateResumeForm from './UpdateResumeForm';

const DesktopResumeViewFragment = graphql`
  fragment DesktopResumeViewFragment on Query {
    viewer {
        __typename
      ... on Account {
        profile @required(action: THROW) {
          ...UpdateResumeFormFragment
        }
      }
    }
  }
`;

export const DesktopResumeView: React.FC<{ data: DesktopResumeViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(DesktopResumeViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');

	return <UpdateResumeForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
