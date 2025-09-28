'use client';
import type { LicensesClientComponentQuery as LicensesClientComponentQueryType } from '@/__generated__/LicensesClientComponentQuery.graphql';
import LicensesClientComponentQuery from '@/__generated__/LicensesClientComponentQuery.graphql';
import type { LicensesViewFragment$key } from '@/__generated__/LicensesViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../../layout/DashboardHeader';
import { ResponsiveResumeBuilder } from '../ResponsiveResumeBuilder';
import ResumeProgress from '../ResumeProgress';
import { DesktopLicensesView } from './DesktopLicensesView';
import { MobileLicensesView } from './MobileLicensesView';

const LicensesViewFragment = graphql`
  fragment LicensesViewFragment on Query {
    ...DashboardHeaderFragment
	...ResumeProgressFragment
    ...DesktopLicensesViewFragment
	...MobileLicensesViewFragment
  }
`;

export default function LicensesView({ queryReference }: { queryReference: PreloadedQuery<LicensesClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(LicensesClientComponentQuery, queryReference);
	const data = useFragment<LicensesViewFragment$key>(LicensesViewFragment, rootData);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<ResumeProgress query={data} />
			<ResponsiveResumeBuilder
				desktopComponent={() => <DesktopLicensesView data={data} />}
				mobileComponent={() => <MobileLicensesView data={data} />}
			/>
		</div>
	);
}
