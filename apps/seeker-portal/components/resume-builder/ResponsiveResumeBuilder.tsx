'use client';

import React, { useEffect, useState } from 'react';
import { MobileResumeBuilderLayout } from './mobile/MobileResumeBuilderLayout';
import { ResumeBuilderLayout } from './ResumeBuilderLayout';

interface ResponsiveResumeBuilderProps {
	children: React.ReactNode;
	mobileChildren: React.ReactNode;
}

export const ResponsiveResumeBuilder: React.FC<ResponsiveResumeBuilderProps> = ({ children, mobileChildren }) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};

		checkIsMobile();
		window.addEventListener('resize', checkIsMobile);
		return () => window.removeEventListener('resize', checkIsMobile);
	}, []);

	if (isMobile) {
		return <MobileResumeBuilderLayout>{mobileChildren}</MobileResumeBuilderLayout>;
	}

	return <ResumeBuilderLayout>{children}</ResumeBuilderLayout>;
};
