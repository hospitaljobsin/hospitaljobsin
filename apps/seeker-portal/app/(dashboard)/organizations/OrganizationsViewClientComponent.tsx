'use client';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { OrganizationsViewClientComponentQuery } from '@/__generated__/OrganizationsViewClientComponentQuery.graphql';
import OrganizationsView from '@/components/organizations/OrganizationsView';

const organizationsQuery = graphql`
	query OrganizationsViewClientComponentQuery {
		...OrganizationsViewFragment
	}
`;

export default function OrganizationsViewClientComponent() {
	const queryData = useLazyLoadQuery<OrganizationsViewClientComponentQuery>(organizationsQuery, {});

	return <OrganizationsView query={queryData} />;
}
