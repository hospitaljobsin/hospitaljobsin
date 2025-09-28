'use client';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
import dynamic from 'next/dynamic';

const LanguagesClientComponent = dynamic(() => import('./LanguagesClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderViewSkeleton />
});

export default function LanguagesPage() {
	return <LanguagesClientComponent />;
}
