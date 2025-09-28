'use client';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
import dynamic from 'next/dynamic';

const PersonalInfoClientComponent = dynamic(() => import('./PersonalInfoClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderViewSkeleton />
});

export default function PersonalInfoPage() {
	return <PersonalInfoClientComponent />;
}
