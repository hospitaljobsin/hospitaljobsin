'use client';
import { Suspense } from 'react';
import DashboardHeader from '../layout/DashboardHeader';
import DashboardHeaderSkeleton from '../layout/DashboardHeaderSkeleton';
import { ResponsiveResumeBuilder } from './ResponsiveResumeBuilder';
import ResumeProgress from './ResumeProgress';
import ResumeProgressSkeleton from './ResumeProgressSkeleton';
import ContentSkeleton from './ContentSkeleton';

interface ResumeBuilderSharedLayoutProps {
	headerQuery?: any;
	progressQuery?: any;
	desktopComponent: React.ComponentType;
	mobileComponent: React.ComponentType;
}

export default function ResumeBuilderSharedLayout({
	headerQuery,
	progressQuery,
	desktopComponent,
	mobileComponent
}: ResumeBuilderSharedLayoutProps) {
	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<Suspense fallback={<DashboardHeaderSkeleton />}>
				{headerQuery ? <DashboardHeader query={headerQuery} /> : <DashboardHeaderSkeleton />}
			</Suspense>
			<Suspense fallback={<ResumeProgressSkeleton />}>
				{progressQuery ? <ResumeProgress query={progressQuery} /> : <ResumeProgressSkeleton />}
			</Suspense>
			<Suspense
				fallback={<ResponsiveResumeBuilder desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
			>
				<ResponsiveResumeBuilder desktopComponent={desktopComponent} mobileComponent={mobileComponent} />
			</Suspense>
		</div>
	);
}
