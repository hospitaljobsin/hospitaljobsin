'use client';

import React from 'react';
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
	return (
		<>
			<div className='lg:hidden'>
				<MobileResumeBuilderLayout>
					<MobileComponent />
				</MobileResumeBuilderLayout>
			</div>
			<div className='hidden lg:block'>
				<ResumeBuilderLayout>
					<DesktopComponent />
				</ResumeBuilderLayout>
			</div>
		</>
	);
};
