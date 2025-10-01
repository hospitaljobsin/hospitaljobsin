import type { MobileCertificationsViewFragment$key } from '@/__generated__/MobileCertificationsViewFragment.graphql';
import React from 'react';
import { graphql, useFragment } from 'react-relay';
import invariant from 'tiny-invariant';
import UpdateCertificationsForm from './UpdateCertificationsForm';

const MobileCertificationsViewFragment = graphql`
  fragment MobileCertificationsViewFragment on Query {
    viewer {
		__typename
      ... on Account {
        profile @required(action: THROW) {
          ...UpdateCertificationsFormFragment
        }
      }
    }
  }
`;

export const MobileCertificationsView: React.FC<{ data: MobileCertificationsViewFragment$key }> = ({ data }) => {
	const fragmentData = useFragment(MobileCertificationsViewFragment, data);
	invariant(fragmentData.viewer.__typename === 'Account', 'Expected profile data to be present');

	return <UpdateCertificationsForm rootQuery={fragmentData.viewer.profile} onSaveChanges={() => {}} />;
};
