'use client';

import links from '@/lib/links';
import { Tab, Tabs } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export const MobileSidebar: React.FC = () => {
	const pathname = usePathname();
	const router = useRouter();

	const tabs = [
		{ key: links.resumeBuilderResume, title: 'Resume' },
		{ key: links.resumeBuilderPersonalInfo, title: 'Personal Details' },
		{ key: links.resumeBuilderIntroduction, title: 'Introduction' },
		{ key: links.resumeBuilderCareerProfile, title: 'Career Profile' },
		{ key: links.resumeBuilderWorkExperience, title: 'Work Experience' },
		{ key: links.resumeBuilderEducation, title: 'Education' },
		{ key: links.resumeBuilderCertifications, title: 'Certifications' },
		{ key: links.resumeBuilderLicenses, title: 'Licenses' },
		{ key: links.resumeBuilderLanguages, title: 'Languages' }
	];

	return (
		<div className='p-4 w-full overflow-x-auto'>
			<Tabs
				selectedKey={pathname}
				onSelectionChange={key => router.push(key as string)}
				classNames={{
					tabList: 'overflow-x-auto',
					cursor: 'shadow-none'
				}}
			>
				{tabs.map(tab => (
					<Tab key={tab.key} title={tab.title} />
				))}
			</Tabs>
		</div>
	);
};
