'use client';
import type { DesktopLanguagesViewFragment$key } from '@/__generated__/DesktopLanguagesViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateLanguagesForm from './UpdateLanguagesForm';

const DesktopLanguagesViewFragment = graphql`
  fragment DesktopLanguagesViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile @required(action: THROW) {
          ...UpdateLanguagesFormFragment
        }
      }
    }
  }
`;

export const DesktopLanguagesView: React.FC<{ data: DesktopLanguagesViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(DesktopLanguagesViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');

	return <UpdateLanguagesForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
