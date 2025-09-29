'use client';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import dynamic from 'next/dynamic';

const LanguagesClientComponent = dynamic(() => import('./LanguagesClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />
});

export default function LanguagesPage() {
	return <LanguagesClientComponent />;
}
