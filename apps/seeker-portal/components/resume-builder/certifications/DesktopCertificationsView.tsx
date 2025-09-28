'use client';
import type { DesktopCertificationsViewFragment$key } from '@/__generated__/DesktopCertificationsViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateCertificationsForm from './UpdateCertificationsForm';

const DesktopCertificationsViewFragment = graphql`
  fragment DesktopCertificationsViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile {
          ...UpdateCertificationsFormFragment
        }
      }
    }
  }
`;

export const DesktopCertificationsView: React.FC<{ data: DesktopCertificationsViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(DesktopCertificationsViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account' && fragmentData.viewer.profile, 'Expected profile data to be present');

	return <UpdateCertificationsForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
