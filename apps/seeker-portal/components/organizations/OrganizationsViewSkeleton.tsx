'use client';
import { Input } from '@heroui/react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import DashboardHeaderSkeleton from '@/components/layout/DashboardHeaderSkeleton';
import OrganizationsGridSkeleton from '@/components/organizations/OrganizationsGridSkeleton';
import { SUPPORT_EMAIL } from '@/lib/constants';

export default function OrganizationsViewSkeleton() {
	return (
		<>
			<DashboardHeaderSkeleton />
			<div className='w-full flex flex-col gap-8 py-8 px-4 max-w-7xl mx-auto'>
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
						startContent={<Search className='w-4 h-4 text-foreground-500' />}
						fullWidth
						classNames={{
							inputWrapper: 'bg-background'
						}}
						variant='bordered'
						isDisabled
					/>
				</div>
				<OrganizationsGridSkeleton />
			</div>
		</>
	);
}
