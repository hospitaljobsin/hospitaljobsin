'use client';
import DashboardHeaderSkeleton from '@/components/layout/DashboardHeaderSkeleton';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ResumeProgressSkeleton from '@/components/resume-builder/ResumeProgressSkeleton';
import dynamic from 'next/dynamic';

const LicensesClientComponent = dynamic(() => import('./LicensesClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />
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

export default function LicensePage() {
	return (
		<div className='w-full h-full flex flex-col'>
			<DashboardHeaderClientComponent />
			<ResumeProgressClientComponent />
			<LicensesClientComponent />
		</div>
	);
}
