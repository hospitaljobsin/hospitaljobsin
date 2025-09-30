'use client';
import type { ResumeClientComponentQuery as ResumeClientComponentQueryType } from '@/__generated__/ResumeClientComponentQuery.graphql';
import ResumeClientComponentQuery from '@/__generated__/ResumeClientComponentQuery.graphql';
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

export default function ResumeView({ queryReference }: { queryReference: PreloadedQuery<ResumeClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(ResumeClientComponentQuery, queryReference);
	const data = useFragment<ResumeViewFragment$key>(ResumeViewFragment, rootData);

	return (
		<ResumeBuilderSharedLayout
			desktopComponent={() => <DesktopResumeView data={data} />}
			mobileComponent={() => <MobileResumeView data={data} />}
		/>
	);
}
