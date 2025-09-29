'use client';
import DashboardHeaderSkeleton from '@/components/layout/DashboardHeaderSkeleton';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import { ResponsiveResumeBuilder } from '@/components/resume-builder/ResponsiveResumeBuilder';
import ResumeProgressSkeleton from '@/components/resume-builder/ResumeProgressSkeleton';
import dynamic from 'next/dynamic';

const LocationPreferencesClientComponent = dynamic(() => import('./LocationPreferencesClientComponent'), {
	ssr: false,
	loading: () => <ResponsiveResumeBuilder desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />
});

const DashboardHeaderClientComponent = dynamic(() => import('@/components/layout/DashboardHeaderClientComponent'), {
	ssr: false,
	loading() {
		return <DashboardHeaderSkeleton />;
	}
});

const ResumeProgressClientComponent = dynamic(() => import('@/components/resume-builder/ResumeProgressClientComponent'), {
	ssr: false,
	loading: () => <ResumeProgressSkeleton />
});

export default function LocationPreferencesPage() {
	return (
		<div className='w-full h-full flex flex-col'>
			<DashboardHeaderClientComponent />
			<ResumeProgressClientComponent />
			<LocationPreferencesClientComponent />
		</div>
	);
}
