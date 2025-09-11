'use client';
import type { OrgDetailHeaderClientComponentQuery as OrgDetailHeaderClientComponentQueryType } from '@/__generated__/OrgDetailHeaderClientComponentQuery.graphql';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import OrgDetailHeader from './OrgDetailHeader';

export const OrgDetailHeaderClientComponentQuery = graphql`
  query OrgDetailHeaderClientComponentQuery($slug: String!) {
	...OrgDetailHeaderFragment @arguments(slug: $slug)
  }
`;

export default function OrgDetailHeaderClientComponent({ slug }: { slug: string }) {
	const data = useLazyLoadQuery<OrgDetailHeaderClientComponentQueryType>(OrgDetailHeaderClientComponentQuery, { slug });
	return <OrgDetailHeader root={data} />;
}
