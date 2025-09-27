'use client';
import React from 'react';
import { MobileWorkExperienceView } from './mobile/MobileWorkExperienceView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const DesktopWorkExperienceView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Work Experience</h1>;
};

export const WorkExperienceView: React.FC = () => {
	return <ResponsiveResumeBuilder desktopComponent={DesktopWorkExperienceView} mobileComponent={MobileWorkExperienceView} />;
};
