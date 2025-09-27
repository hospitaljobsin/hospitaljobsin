'use client';
import React from 'react';
import { MobileSkillsView } from './mobile/MobileSkillsView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const DesktopSkillsView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Skills</h1>;
};

export const SkillsView: React.FC = () => {
	return <ResponsiveResumeBuilder desktopComponent={DesktopSkillsView} mobileComponent={MobileSkillsView} />;
};
