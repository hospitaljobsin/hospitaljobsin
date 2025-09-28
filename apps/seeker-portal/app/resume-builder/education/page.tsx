'use client';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
import dynamic from 'next/dynamic';

const EducationClientComponent = dynamic(() => import('./EducationClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderViewSkeleton />
});

export default function EducationPage() {
	return <EducationClientComponent />;
}
