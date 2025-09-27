'use client';
import React from 'react';
import { MobilePersonalInfoView } from './mobile/MobilePersonalInfoView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const DesktopPersonalInfoView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Personal Info</h1>;
};

export const PersonalInfoView: React.FC = () => {
	return <ResponsiveResumeBuilder desktopComponent={DesktopPersonalInfoView} mobileComponent={MobilePersonalInfoView} />;
};
