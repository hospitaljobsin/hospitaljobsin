'use client';

import React, { useEffect, useState } from 'react';
import { MobileResumeBuilderLayout } from './MobileResumeBuilderLayout';
import { ResumeBuilderLayout } from './ResumeBuilderLayout';

interface ResponsiveResumeBuilderProps {
	desktopComponent: React.ComponentType;
	mobileComponent: React.ComponentType;
}

export const ResponsiveResumeBuilder: React.FC<ResponsiveResumeBuilderProps> = ({
	desktopComponent: DesktopComponent,
	mobileComponent: MobileComponent
}) => {
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
		return (
			<MobileResumeBuilderLayout>
				<MobileComponent />
			</MobileResumeBuilderLayout>
		);
	}

	return (
		<ResumeBuilderLayout>
			<DesktopComponent />
		</ResumeBuilderLayout>
	);
};
