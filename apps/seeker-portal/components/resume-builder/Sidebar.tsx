'use client';

import links from '@/lib/links';
import { Tab, Tabs } from '@heroui/react';
import { Award, Briefcase, Building, FileText, GraduationCap, Languages, MessageSquare, Shield, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export const Sidebar: React.FC = () => {
	const pathname = usePathname();
	const router = useRouter();

	const tabs = [
		{ key: links.resumeBuilderResume, title: 'Resume', icon: FileText },
		{ key: links.resumeBuilderPersonalInfo, title: 'Personal Details', icon: User },
		{ key: links.resumeBuilderIntroduction, title: 'Introduction', icon: MessageSquare },
		{ key: links.resumeBuilderCareerProfile, title: 'Career Profile', icon: Briefcase },
		{ key: links.resumeBuilderWorkExperience, title: 'Work Experience', icon: Building },
		{ key: links.resumeBuilderEducation, title: 'Education', icon: GraduationCap },
		{ key: links.resumeBuilderCertifications, title: 'Certifications', icon: Award },
		{ key: links.resumeBuilderLicenses, title: 'Licenses', icon: Shield },
		{ key: links.resumeBuilderLanguages, title: 'Languages', icon: Languages }
	];

	return (
		<Tabs
			size='lg'
			selectedKey={pathname}
			onSelectionChange={key => router.push(key as string)}
			isVertical
			classNames={{
				base: 'w-full min-w-64',
				tabList: 'w-full',
				tab: 'justify-start',
				cursor: 'shadow-none'
			}}
		>
			{tabs.map(tab => {
				const Icon = tab.icon;
				return (
					<Tab
						key={tab.key}
						title={
							<div className='flex items-center gap-4'>
								<Icon size={18} />
								{tab.title}
							</div>
						}
					/>
				);
			})}
		</Tabs>
	);
};
