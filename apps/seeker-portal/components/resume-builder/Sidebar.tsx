'use client';

import links from '@/lib/links';
import { Tab, Tabs } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export const Sidebar: React.FC = () => {
	const pathname = usePathname();
	const router = useRouter();

	const tabs = [
		{ key: links.resumeBuilderPersonalInfo, title: 'Personal Info' },
		{ key: links.resumeBuilderIntroduction, title: 'Introduction' },
		{ key: links.resumeBuilderCareerProfile, title: 'Career Profile' },
		{ key: links.resumeBuilderWorkExperience, title: 'Work Experience' },
		{ key: links.resumeBuilderEducation, title: 'Education' },
		{ key: links.resumeBuilderCertifications, title: 'Certifications' },
		{ key: links.resumeBuilderLicenses, title: 'Licenses' },
		{ key: links.resumeBuilderLocationPreferences, title: 'Location Preferences' },
		{ key: links.resumeBuilderLanguages, title: 'Languages' }
	];

	return (
		<Tabs
			size='lg'
			selectedKey={pathname}
			onSelectionChange={key => router.push(key as string)}
			isVertical
			classNames={{
				base: 'w-full',
				tabList: 'w-full',
				tab: 'justify-start',
				cursor: 'shadow-none'
			}}
		>
			{tabs.map(tab => (
				<Tab key={tab.key} title={tab.title} />
			))}
		</Tabs>
	);
};
