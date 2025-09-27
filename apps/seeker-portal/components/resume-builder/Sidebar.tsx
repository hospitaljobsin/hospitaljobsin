'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
	href: string;
	children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, children }) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	const baseClasses = 'flex items-center gap-3 rounded-lg px-4 py-3 font-medium';
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
		<nav className='flex flex-col gap-1'>
			<NavItem href='/resume-builder/personal-info'>Personal Info</NavItem>
			<NavItem href='/resume-builder/summary'>Summary</NavItem>
			<NavItem href='/resume-builder/work-experience'>Work Experience</NavItem>
			<NavItem href='/resume-builder/education'>Education</NavItem>
			<NavItem href='/resume-builder/skills'>Skills</NavItem>
			<NavItem href='/resume-builder/certifications'>Certifications</NavItem>
			<NavItem href='/resume-builder/additional'>Additional</NavItem>
		</nav>
	);
};
