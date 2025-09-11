'use client';
import links from '@/lib/links';
import { Tab, Tabs } from '@heroui/react';
import { HomeIcon, UserIcon } from 'lucide-react';

export default function OrganizationTabsSkeleton() {
	return (
		<div className='flex w-full flex-col'>
			<Tabs
				aria-label='Organization Detail Menu'
				color='default'
				variant='underlined'
				classNames={{
					tabList: 'py-0',
					tab: 'py-6'
				}}
				isDisabled
			>
				<Tab
					key={links.organizationDetail('')}
					title={
						<div className='flex items-center space-x-2'>
							<HomeIcon />
							<span>Overview</span>
						</div>
					}
				/>
				<Tab
					key={links.organizationDetailMembers('')}
					title={
						<div className='flex items-center space-x-2'>
							<UserIcon />
							<span>Members</span>
						</div>
					}
				/>
			</Tabs>
		</div>
	);
}
