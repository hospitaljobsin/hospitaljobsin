'use client';
import type { PersonalInfoClientComponentQuery as PersonalInfoClientComponentQueryType } from '@/__generated__/PersonalInfoClientComponentQuery.graphql';
import PersonalInfoClientComponentQuery from '@/__generated__/PersonalInfoClientComponentQuery.graphql';
import type { PersonalInfoViewFragment$key } from '@/__generated__/PersonalInfoViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import ResumeBuilderSharedLayout from '../ResumeBuilderSharedLayout';
import { DesktopPersonalInfoView } from './DesktopPersonalInfoView';
import { MobilePersonalInfoView } from './MobilePersonalInfoView';

const PersonalInfoViewFragment = graphql`
  fragment PersonalInfoViewFragment on Query {
	...ResumeProgressFragment
    ...DesktopPersonalInfoViewFragment
	...MobilePersonalInfoViewFragment
  }
`;

export default function PersonalInfoView({ queryReference }: { queryReference: PreloadedQuery<PersonalInfoClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(PersonalInfoClientComponentQuery, queryReference);
	const data = useFragment<PersonalInfoViewFragment$key>(PersonalInfoViewFragment, rootData);

	return (
		<ResumeBuilderSharedLayout
			progressQuery={data}
			desktopComponent={() => <DesktopPersonalInfoView data={data} />}
			mobileComponent={() => <MobilePersonalInfoView data={data} />}
		/>
	);
}
