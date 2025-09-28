'use client';
import type { CertificationsClientComponentQuery as CertificationsClientComponentQueryType } from '@/__generated__/CertificationsClientComponentQuery.graphql';
import CertificationsClientComponentQuery from '@/__generated__/CertificationsClientComponentQuery.graphql';
import type { CertificationsViewFragment$key } from '@/__generated__/CertificationsViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../../layout/DashboardHeader';
import { ResponsiveResumeBuilder } from '../ResponsiveResumeBuilder';
import { DesktopCertificationsView } from './DesktopCertificationsView';
import { MobileCertificationsView } from './MobileCertificationsView';

const CertificationsViewFragment = graphql`
  fragment CertificationsViewFragment on Query {
    ...DashboardHeaderFragment
    ...DesktopCertificationsViewFragment
	...MobileCertificationsViewFragment
  }
`;

export default function CertificationsView({ queryReference }: { queryReference: PreloadedQuery<CertificationsClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(CertificationsClientComponentQuery, queryReference);
	const data = useFragment<CertificationsViewFragment$key>(CertificationsViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResponsiveResumeBuilder
				desktopComponent={() => <DesktopCertificationsView data={data} />}
				mobileComponent={() => <MobileCertificationsView data={data} />}
			/>
		</div>
	);
}
