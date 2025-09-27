'use client';
import React from 'react';
import { MobileAdditionalView } from './mobile/MobileAdditionalView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const DesktopAdditionalView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Additional</h1>;
};

export const AdditionalView: React.FC = () => {
	return <ResponsiveResumeBuilder desktopComponent={DesktopAdditionalView} mobileComponent={MobileAdditionalView} />;
};
