'use client';
import { Input } from '@heroui/react';
import { Search } from 'lucide-react';
import DashboardHeaderSkeleton from '@/components/layout/DashboardHeaderSkeleton';
import OrganizationsGridSkeleton from '@/components/organizations/OrganizationsGridSkeleton';

export default function OrganizationsViewSkeleton() {
	return (
		<>
			<DashboardHeaderSkeleton />
			<div className='w-full flex flex-col gap-8 py-8 px-4 max-w-7xl mx-auto'>
				<div className='flex flex-col gap-4 w-full'>
					<div className='flex flex-col gap-2'>
						<h1 className='text-lg font-semibold text-foreground-600'>All Organizations</h1>
						<p className='text-foreground-500'>Browse healthcare organizations hiring on our platform</p>
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
