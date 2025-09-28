'use client';
import type { DesktopLicensesViewFragment$key } from '@/__generated__/DesktopLicensesViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateLicensesForm from './UpdateLicensesForm';

const DesktopLicensesViewFragment = graphql`
  fragment DesktopLicensesViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile @required(action: THROW) {
          ...UpdateLicensesFormFragment
        }
      }
    }
  }
`;

export const DesktopLicensesView: React.FC<{ data: DesktopLicensesViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(DesktopLicensesViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');
	return <UpdateLicensesForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
