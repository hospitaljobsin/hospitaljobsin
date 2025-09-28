'use client';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
import dynamic from 'next/dynamic';

const CertificationsClientComponent = dynamic(() => import('./CertificationsClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderViewSkeleton />
});

export default function CertificationsPage() {
	return <CertificationsClientComponent />;
}
