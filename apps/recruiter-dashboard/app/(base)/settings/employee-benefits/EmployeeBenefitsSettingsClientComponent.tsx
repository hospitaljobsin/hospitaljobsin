'use client';
import type { EmployeeBenefitsSettingsClientComponentQuery as EmployeeBenefitsSettingsClientComponentQueryType } from '@/__generated__/EmployeeBenefitsSettingsClientComponentQuery.graphql';
import EmployeeBenefitsTab from '@/components/org-settings/employee-benefits-tab/EmployeeBenefitsTab';
import useOrganization from '@/lib/hooks/useOrganization';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';

export const EmployeeBenefitsSettingsClientComponentQuery = graphql`
  query EmployeeBenefitsSettingsClientComponentQuery($slug: String!) {
	...EmployeeBenefitsTabFragment @arguments(slug: $slug)
  }
`;

export default function EmployeeBenefitsSettingsClientComponent() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	invariant(organizationSlug, 'Organization slug is required in headers');

	const initialQueryRef = loadQuery<EmployeeBenefitsSettingsClientComponentQueryType>(
		environment,
		EmployeeBenefitsSettingsClientComponentQuery,
		{
			slug: organizationSlug
		},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return <EmployeeBenefitsTab initialQueryRef={initialQueryRef} />;
}
