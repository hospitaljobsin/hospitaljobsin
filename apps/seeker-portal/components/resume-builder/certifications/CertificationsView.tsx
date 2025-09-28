'use client';
import type { CertificationsClientComponentQuery as CertificationsClientComponentQueryType } from '@/__generated__/CertificationsClientComponentQuery.graphql';
import CertificationsClientComponentQuery from '@/__generated__/CertificationsClientComponentQuery.graphql';
import type { CertificationsViewFragment$key } from '@/__generated__/CertificationsViewFragment.graphql';
import React from 'react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../../layout/DashboardHeader';
import { MobileCertificationsView } from './MobileCertificationsView';
import { ResponsiveResumeBuilder } from '../ResponsiveResumeBuilder';

const CertificationsViewFragment = graphql`
  fragment CertificationsViewFragment on Query {
    ...DashboardHeaderFragment
  }
`;

const DesktopCertificationsView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Certifications</h1>;
};

export default function CertificationsView({ queryReference }: { queryReference: PreloadedQuery<CertificationsClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(CertificationsClientComponentQuery, queryReference);
	const data = useFragment<CertificationsViewFragment$key>(CertificationsViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResponsiveResumeBuilder desktopComponent={DesktopCertificationsView} mobileComponent={MobileCertificationsView} />
		</div>
	);
}
