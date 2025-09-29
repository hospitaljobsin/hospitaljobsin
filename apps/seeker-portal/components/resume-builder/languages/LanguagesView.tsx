'use client';
import type { LanguagesClientComponentQuery as LanguagesClientComponentQueryType } from '@/__generated__/LanguagesClientComponentQuery.graphql';
import LanguagesClientComponentQuery from '@/__generated__/LanguagesClientComponentQuery.graphql';
import type { LanguagesViewFragment$key } from '@/__generated__/LanguagesViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import ResumeBuilderSharedLayout from '../ResumeBuilderSharedLayout';
import { DesktopLanguagesView } from './DesktopLanguagesView';
import { MobileLanguagesView } from './MobileLanguagesView';

const LanguagesViewFragment = graphql`
  fragment LanguagesViewFragment on Query {
	...ResumeProgressFragment
    ...DesktopLanguagesViewFragment
	...MobileLanguagesViewFragment
  }
`;

export default function LanguagesView({ queryReference }: { queryReference: PreloadedQuery<LanguagesClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(LanguagesClientComponentQuery, queryReference);
	const data = useFragment<LanguagesViewFragment$key>(LanguagesViewFragment, rootData);

	return (
		<ResumeBuilderSharedLayout
			progressQuery={data}
			desktopComponent={() => <DesktopLanguagesView data={data} />}
			mobileComponent={() => <MobileLanguagesView data={data} />}
		/>
	);
}
