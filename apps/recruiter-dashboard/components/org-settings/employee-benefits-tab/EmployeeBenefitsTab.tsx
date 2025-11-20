'use client';
import { Button, useDisclosure } from '@heroui/react';
import { Plus } from 'lucide-react';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import EmployeeBenefitsSettingsClientComponentQuery, {
	type EmployeeBenefitsSettingsClientComponentQuery as EmployeeBenefitsSettingsClientComponentQueryType
} from '@/__generated__/EmployeeBenefitsSettingsClientComponentQuery.graphql';
import type { EmployeeBenefitsTabFragment$key } from '@/__generated__/EmployeeBenefitsTabFragment.graphql';
import NotFoundView from '@/components/NotFoundView';
import EmployeeBenefitsList from './EmployeeBenefitsList';

const EmployeeBenefitsTabFragment = graphql`
 fragment EmployeeBenefitsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        organization(slug: $slug) {
            __typename
            ... on Organization {
				isAdmin
                ...EmployeeBenefitsListFragment
            }
        }
  }
`;

export default function EmployeeBenefitsTab({
	initialQueryRef
}: {
	initialQueryRef: PreloadedQuery<EmployeeBenefitsSettingsClientComponentQueryType>;
}) {
	const rootQuery = usePreloadedQuery(EmployeeBenefitsSettingsClientComponentQuery, initialQueryRef);
	const data = useFragment<EmployeeBenefitsTabFragment$key>(EmployeeBenefitsTabFragment, rootQuery);

	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

	if (data.organization.__typename !== 'Organization' || !data.organization.isAdmin) {
		return <NotFoundView />;
	}

	return (
		<div className='w-full h-full flex flex-col items-center gap-6'>
			<div className='flex w-full justify-between items-center'>
				<h2 className='text-xl font-medium'>Employee Benefits</h2>
				<Button color='primary' startContent={<Plus size={16} />} onPress={onOpen}>
					Add Benefit
				</Button>
			</div>
			<EmployeeBenefitsList rootQuery={data.organization} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
		</div>
	);
}
