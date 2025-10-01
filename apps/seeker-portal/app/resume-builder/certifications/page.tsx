'use client';
import dynamic from 'next/dynamic';
import DashboardHeaderSkeleton from '@/components/layout/DashboardHeaderSkeleton';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import { ResponsiveResumeBuilder } from '@/components/resume-builder/ResponsiveResumeBuilder';
import ResumeProgressSkeleton from '@/components/resume-builder/ResumeProgressSkeleton';

const CertificationsClientComponent = dynamic(() => import('./CertificationsClientComponent'), {
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

export default function CertificationsPage() {
	return (
		<div className='w-full h-full flex flex-col bg-background-600'>
			<DashboardHeaderClientComponent />
			<div className='w-full h-full flex flex-1 max-w-7xl mx-auto flex-col px-4 py-6'>
				<ResumeProgressClientComponent />
				<CertificationsClientComponent />
			</div>
		</div>
	);
}
