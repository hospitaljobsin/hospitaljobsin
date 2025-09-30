'use client';
import type { IntroductionClientComponentQuery as IntroductionClientComponentQueryType } from '@/__generated__/IntroductionClientComponentQuery.graphql';
import IntroductionClientComponentQuery from '@/__generated__/IntroductionClientComponentQuery.graphql';
import type { IntroductionViewFragment$key } from '@/__generated__/IntroductionViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import ResumeBuilderSharedLayout from '../ResumeBuilderSharedLayout';
import { DesktopIntroductionView } from './DesktopIntroductionView';
import { MobileIntroductionView } from './MobileIntroductionView';

const IntroductionViewFragment = graphql`
  fragment IntroductionViewFragment on Query {
    ...DesktopIntroductionViewFragment
    ...MobileIntroductionViewFragment
  }
`;

export default function IntroductionView({ queryReference }: { queryReference: PreloadedQuery<IntroductionClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(IntroductionClientComponentQuery, queryReference);
	const data = useFragment<IntroductionViewFragment$key>(IntroductionViewFragment, rootData);

	return (
		<ResumeBuilderSharedLayout
			desktopComponent={() => <DesktopIntroductionView data={data} />}
			mobileComponent={() => <MobileIntroductionView data={data} />}
		/>
	);
}
