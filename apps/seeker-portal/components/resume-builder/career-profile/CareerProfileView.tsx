'use client';
import type { CareerProfileClientComponentQuery as CareerProfileClientComponentQueryType } from '@/__generated__/CareerProfileClientComponentQuery.graphql';
import CareerProfileClientComponentQuery from '@/__generated__/CareerProfileClientComponentQuery.graphql';
import type { CareerProfileViewFragment$key } from '@/__generated__/CareerProfileViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import ResumeBuilderSharedLayout from '../ResumeBuilderSharedLayout';
import { DesktopCareerProfileView } from './DesktopCareerProfileView';
import { MobileCareerProfileView } from './MobileCareerProfileView';

const CareerProfileViewFragment = graphql`
  fragment CareerProfileViewFragment on Query {
    ...DesktopCareerProfileViewFragment
    ...MobileCareerProfileViewFragment
  }
`;

export default function CareerProfileView({ queryReference }: { queryReference: PreloadedQuery<CareerProfileClientComponentQueryType> }) {
	const rootData = usePreloadedQuery(CareerProfileClientComponentQuery, queryReference);
	const data = useFragment<CareerProfileViewFragment$key>(CareerProfileViewFragment, rootData);

	return (
		<ResumeBuilderSharedLayout
			desktopComponent={() => <DesktopCareerProfileView data={data} />}
			mobileComponent={() => <MobileCareerProfileView data={data} />}
		/>
	);
}
