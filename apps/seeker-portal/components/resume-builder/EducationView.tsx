'use client';
import React from 'react';
import { MobileEducationView } from './mobile/MobileEducationView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const DesktopEducationView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Education</h1>;
};

export const EducationView: React.FC = () => {
	return <ResponsiveResumeBuilder desktopComponent={DesktopEducationView} mobileComponent={MobileEducationView} />;
};
