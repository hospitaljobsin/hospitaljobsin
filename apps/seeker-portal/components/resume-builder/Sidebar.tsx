'use client';

import links from '@/lib/links';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItemProps {
	href: string;
	children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, children }) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	const baseClasses = 'flex items-center gap-3 rounded-lg px-4 py-3 font-medium whitespace-nowrap';
	const activeClasses = 'bg-primary/10 font-semibold text-primary dark:bg-primary/20';
	const inactiveClasses = 'text-background-dark/60 hover:bg-primary/10 dark:text-background-light/60 dark:hover:bg-primary/20';

	return (
		<Link className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} href={href}>
			{children}
		</Link>
	);
};

export const Sidebar: React.FC = () => {
	return (
		<nav className='flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0'>
			<NavItem href={links.resumeBuilderPersonalInfo}>Personal Info</NavItem>
			<NavItem href={links.resumeBuilderWorkExperience}>Work Experience</NavItem>
			<NavItem href={links.resumeBuilderEducation}>Education</NavItem>
			<NavItem href={links.resumeBuilderCertifications}>Certifications</NavItem>
			<NavItem href={links.resumeBuilderLicenses}>Licenses</NavItem>
			<NavItem href={links.resumeBuilderLocationPreferences}>Location Preferences</NavItem>
			<NavItem href={links.resumeBuilderLanguages}>Languages</NavItem>
		</nav>
	);
};
