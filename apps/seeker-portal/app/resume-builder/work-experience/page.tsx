'use client';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
import dynamic from 'next/dynamic';

const WorkExperienceClientComponent = dynamic(() => import('./WorkExperienceClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderViewSkeleton />
});

export default function WorkExperiencePage() {
	return <WorkExperienceClientComponent />;
}
