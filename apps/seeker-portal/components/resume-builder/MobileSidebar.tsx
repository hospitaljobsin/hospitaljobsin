'use client';

import links from '@/lib/links';
import { Tab, Tabs } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { FileText, User, MessageSquare, Briefcase, Building, GraduationCap, Award, Shield, Languages } from 'lucide-react';

export const MobileSidebar: React.FC = () => {
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
		<div className='p-4 w-full overflow-x-auto'>
			<Tabs
				selectedKey={pathname}
				onSelectionChange={key => router.push(key as string)}
				classNames={{
					tabList: 'overflow-x-auto',
					cursor: 'shadow-none'
				}}
			>
				{tabs.map(tab => {
					const Icon = tab.icon;
					return (
						<Tab
							key={tab.key}
							title={
								<div className='flex items-center gap-2'>
									<Icon size={18} />
									{tab.title}
								</div>
							}
						/>
					);
				})}
			</Tabs>
		</div>
	);
};
