'use client';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
import dynamic from 'next/dynamic';

const LicensesClientComponent = dynamic(() => import('./LicensesClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderViewSkeleton />
});

export default function LicensePage() {
	return <LicensesClientComponent />;
}
