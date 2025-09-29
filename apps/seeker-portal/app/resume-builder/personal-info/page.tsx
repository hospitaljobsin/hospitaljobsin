'use client';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import dynamic from 'next/dynamic';

const PersonalInfoClientComponent = dynamic(() => import('./PersonalInfoClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />
});

export default function PersonalInfoPage() {
	return <PersonalInfoClientComponent />;
}
