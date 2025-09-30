'use client';
import type { CareerProfileClientComponentQuery as CareerProfileClientComponentQueryType } from '@/__generated__/CareerProfileClientComponentQuery.graphql';
import CareerProfileClientComponentQuery from '@/__generated__/CareerProfileClientComponentQuery.graphql';
import type { ResumeViewFragment$key } from '@/__generated__/ResumeViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import ResumeBuilderSharedLayout from '../ResumeBuilderSharedLayout';
import { DesktopResumeView } from './DesktopResumeView';
import { MobileResumeView } from './MobileResumeView';

const ResumeViewFragment = graphql`
  fragment ResumeViewFragment on Query {
    ...DesktopResumeViewFragment
    ...MobileResumeViewFragment
  }
`;

export default function ResumeView({ queryReference }: { queryReference: PreloadedQuery<CareerProfileClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(CareerProfileClientComponentQuery, queryReference);
	const data = useFragment<ResumeViewFragment$key>(ResumeViewFragment, rootData);

	return (
		<ResumeBuilderSharedLayout
			desktopComponent={() => <DesktopResumeView data={data} />}
			mobileComponent={() => <MobileResumeView data={data} />}
		/>
	);
}
