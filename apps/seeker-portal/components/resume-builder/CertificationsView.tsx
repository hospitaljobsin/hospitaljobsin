'use client';
import React from 'react';
import { MobileCertificationsView } from './mobile/MobileCertificationsView';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

const DesktopCertificationsView: React.FC = () => {
	return <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Certifications</h1>;
};

export const CertificationsView: React.FC = () => {
	return <ResponsiveResumeBuilder desktopComponent={DesktopCertificationsView} mobileComponent={MobileCertificationsView} />;
};
