'use client';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import dynamic from 'next/dynamic';

const WorkExperienceClientComponent = dynamic(() => import('./WorkExperienceClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />
});

export default function WorkExperiencePage() {
	return <WorkExperienceClientComponent />;
}
