'use client';
import React from 'react';
import { MobileSummaryView } from './mobile/MobileSummaryView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const DesktopSummaryView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Summary</h1>;
};

export const SummaryView: React.FC = () => {
	return <ResponsiveResumeBuilder desktopComponent={DesktopSummaryView} mobileComponent={MobileSummaryView} />;
};
