'use client';
import type { CertificationsClientComponentQuery as CertificationsClientComponentQueryType } from '@/__generated__/CertificationsClientComponentQuery.graphql';
import CertificationsClientComponentQuery from '@/__generated__/CertificationsClientComponentQuery.graphql';
import type { CertificationsViewFragment$key } from '@/__generated__/CertificationsViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import ResumeBuilderSharedLayout from '../ResumeBuilderSharedLayout';
import { DesktopCertificationsView } from './DesktopCertificationsView';
import { MobileCertificationsView } from './MobileCertificationsView';

const CertificationsViewFragment = graphql`
  fragment CertificationsViewFragment on Query {
    ...DashboardHeaderFragment
	...ResumeProgressFragment
    ...DesktopCertificationsViewFragment
	...MobileCertificationsViewFragment
  }
`;

export default function CertificationsView({ queryReference }: { queryReference: PreloadedQuery<CertificationsClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(CertificationsClientComponentQuery, queryReference);
	const data = useFragment<CertificationsViewFragment$key>(CertificationsViewFragment, rootData);

	return (
		<ResumeBuilderSharedLayout
			headerQuery={data}
			progressQuery={data}
			desktopComponent={() => <DesktopCertificationsView data={data} />}
			mobileComponent={() => <MobileCertificationsView data={data} />}
		/>
	);
}
