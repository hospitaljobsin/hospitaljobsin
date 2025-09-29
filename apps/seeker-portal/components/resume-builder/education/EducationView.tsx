'use client';
import type { EducationClientComponentQuery as EducationClientComponentQueryType } from '@/__generated__/EducationClientComponentQuery.graphql';
import EducationClientComponentQuery from '@/__generated__/EducationClientComponentQuery.graphql';
import type { EducationViewFragment$key } from '@/__generated__/EducationViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import ResumeBuilderSharedLayout from '../ResumeBuilderSharedLayout';
import { DesktopEducationView } from './DesktopEducationView';
import { MobileEducationView } from './MobileEducationView';

const EducationViewFragment = graphql`
  fragment EducationViewFragment on Query {
    ...DashboardHeaderFragment
	...ResumeProgressFragment
    ...DesktopEducationViewFragment
	...MobileEducationViewFragment
  }
`;

export default function EducationView({ queryReference }: { queryReference: PreloadedQuery<EducationClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(EducationClientComponentQuery, queryReference);
	const data = useFragment<EducationViewFragment$key>(EducationViewFragment, rootData);

	return (
		<ResumeBuilderSharedLayout
			headerQuery={data}
			progressQuery={data}
			desktopComponent={() => <DesktopEducationView data={data} />}
			mobileComponent={() => <MobileEducationView data={data} />}
		/>
	);
}
