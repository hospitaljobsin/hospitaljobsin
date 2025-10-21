'use client';
import { Input } from '@heroui/react';
import { Search } from 'lucide-react';
import { Suspense, useState } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { OrganizationsViewFragment$key } from '@/__generated__/OrganizationsViewFragment.graphql';
import DashboardHeader from '../layout/DashboardHeader';
import OrganizationsGrid from './OrganizationsGrid';
import OrganizationsGridSkeleton from './OrganizationsGridSkeleton';

const OrganizationsViewFragment = graphql`
	fragment OrganizationsViewFragment on Query {
		...OrganizationsGridFragment
	}
`;

interface OrganizationsViewProps {
	query: OrganizationsViewFragment$key;
}

export default function OrganizationsView({ query }: OrganizationsViewProps) {
	const data = useFragment(OrganizationsViewFragment, query);
	const [searchValue, setSearchValue] = useState('');

	return (
		<div className='w-full flex flex-col h-full bg-background-600'>
			<DashboardHeader query={query} />
			<div className='w-full flex flex-col gap-8 py-8 px-6 max-w-7xl mx-auto bg-background-600'>
				<div className='flex flex-col gap-4 w-full'>
					<div className='flex flex-col gap-2'>
						<h1 className='text-lg font-semibold text-foreground-600'>All Organizations</h1>
						<p className='text-foreground-500'>Browse healthcare organizations hiring on our platform</p>
					</div>
					<Input
						type='search'
						placeholder='Search organizations...'
						value={searchValue}
						onValueChange={setSearchValue}
						startContent={<Search className='w-4 h-4 text-foreground-500' />}
						fullWidth
						classNames={{
							inputWrapper: 'bg-background'
						}}
						variant='bordered'
					/>
				</div>

				<Suspense fallback={<OrganizationsGridSkeleton />}>
					<OrganizationsGrid query={data} searchTerm={searchValue} />
				</Suspense>
			</div>
		</div>
	);
}
