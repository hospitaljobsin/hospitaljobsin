'use client';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
import dynamic from 'next/dynamic';

const LocationPreferencesClientComponent = dynamic(() => import('./LocationPreferencesClientComponent'), {
	ssr: false,
	loading: () => <ResumeBuilderViewSkeleton />
});

export default function LocationPreferencesPage() {
	return <LocationPreferencesClientComponent />;
}
