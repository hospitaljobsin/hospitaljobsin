'use client';

import React, { useState, useEffect } from 'react';
import { ResumeBuilderLayout } from './ResumeBuilderLayout';
import { MobileResumeBuilderLayout } from './MobileResumeBuilderLayout';

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
