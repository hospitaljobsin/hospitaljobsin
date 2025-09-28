import type { MobileLicensesViewFragment$key } from '@/__generated__/MobileLicensesViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateLicensesForm from './UpdateLicensesForm';

const MobileLicensesViewFragment = graphql`
  fragment MobileLicensesViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile {
          ...UpdateLicensesFormFragment
        }
      }
    }
  }
`;

export const MobileLicensesView: React.FC<{ data: MobileLicensesViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(MobileLicensesViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account' && fragmentData.viewer.profile, 'Expected profile data to be present');

	return <UpdateLicensesForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
