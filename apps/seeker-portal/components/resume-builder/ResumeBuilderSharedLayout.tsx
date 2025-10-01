'use client';
import { Suspense } from 'react';
import ContentSkeleton from './ContentSkeleton';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';

interface ResumeBuilderSharedLayoutProps {
	desktopComponent: React.ComponentType;
	mobileComponent: React.ComponentType;
}

export default function ResumeBuilderSharedLayout({ desktopComponent, mobileComponent }: ResumeBuilderSharedLayoutProps) {
	return (
		<Suspense
			fallback={<ResponsiveResumeBuilder desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<ResponsiveResumeBuilder desktopComponent={desktopComponent} mobileComponent={mobileComponent} />
		</Suspense>
	);
}
