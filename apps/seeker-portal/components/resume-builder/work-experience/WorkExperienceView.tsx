'use client';
import type { WorkExperienceClientComponentQuery as WorkExperienceClientComponentQueryType } from '@/__generated__/WorkExperienceClientComponentQuery.graphql';
import WorkExperienceClientComponentQuery from '@/__generated__/WorkExperienceClientComponentQuery.graphql';
import type { WorkExperienceViewFragment$key } from '@/__generated__/WorkExperienceViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import ResumeBuilderSharedLayout from '../ResumeBuilderSharedLayout';
import { DesktopWorkExperienceView } from './DesktopWorkExperienceView';
import { MobileWorkExperienceView } from './MobileWorkExperienceView';

const WorkExperienceViewFragment = graphql`
  fragment WorkExperienceViewFragment on Query {
	...ResumeProgressFragment
    ...DesktopWorkExperienceViewFragment
	...MobileWorkExperienceViewFragment
  }
`;

export default function WorkExperienceView({ queryReference }: { queryReference: PreloadedQuery<WorkExperienceClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(WorkExperienceClientComponentQuery, queryReference);
	const data = useFragment<WorkExperienceViewFragment$key>(WorkExperienceViewFragment, rootData);

	return (
		<ResumeBuilderSharedLayout
			progressQuery={data}
			desktopComponent={() => <DesktopWorkExperienceView data={data} />}
			mobileComponent={() => <MobileWorkExperienceView data={data} />}
		/>
	);
}
