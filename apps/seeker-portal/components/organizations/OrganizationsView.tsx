'use client';
import { Input } from '@heroui/react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { OrganizationsViewFragment$key } from '@/__generated__/OrganizationsViewFragment.graphql';
import { APP_NAME, SUPPORT_EMAIL } from '@/lib/constants';
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
		<>
			<title>{`Browse Recruiters | ${APP_NAME}`}</title>
			<div className='w-full flex flex-col h-full bg-background-600'>
				<DashboardHeader query={query} />
				<div className='w-full flex flex-col gap-8 py-8 px-6 max-w-7xl mx-auto bg-background-600'>
					<div className='flex flex-col gap-4 w-full'>
						<div className='w-full flex flex-col sm:flex-row justify-between sm:items-end gap-6'>
							<div className='flex flex-col gap-2'>
								<p className='text-foreground-500 font-medium'>Browse healthcare organizations hiring on our platform</p>
							</div>
							<p className='text-foreground-500 text-sm sm:text-right'>
								Not seeing your organization here?{' '}
								<Link href={`mailto:${SUPPORT_EMAIL}`} className='text-sm'>
									Let us know
								</Link>
							</p>
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
		</>
	);
}
