'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface MobileNavItemProps {
	href: string;
	children: React.ReactNode;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ href, children }) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full ${
				isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
			}`}
			href={href}
		>
			{children}
		</Link>
	);
};

export const MobileSidebar: React.FC = () => {
	return (
		<div className='flex gap-2 p-4 overflow-x-auto'>
			<MobileNavItem href='/resume-builder/personal-info'>Personal</MobileNavItem>
			<MobileNavItem href='/resume-builder/summary'>Summary</MobileNavItem>
			<MobileNavItem href='/resume-builder/work-experience'>Experience</MobileNavItem>
			<MobileNavItem href='/resume-builder/education'>Education</MobileNavItem>
			<MobileNavItem href='/resume-builder/skills'>Skills</MobileNavItem>
			<MobileNavItem href='/resume-builder/certifications'>Certs</MobileNavItem>
			<MobileNavItem href='/resume-builder/additional'>More</MobileNavItem>
		</div>
	);
};
