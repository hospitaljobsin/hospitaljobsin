'use client';
import DashboardHeaderSkeleton from '@/components/layout/DashboardHeaderSkeleton';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import { ResponsiveResumeBuilder } from '@/components/resume-builder/ResponsiveResumeBuilder';
import ResumeProgressSkeleton from '@/components/resume-builder/ResumeProgressSkeleton';
import dynamic from 'next/dynamic';

// TODO: add compulsory fields list to complete profile
// instead of having this on the resume builder page itself (which clutters UX)
// we let anyone to visit the job apply page, provided they are authenticated.
// when they click apply and their profile is incomplete, we show a modal
// that tells them to complete their profile. This way, we don't interrupt
// users who are just browsing jobs and might not want to complete their profile yet.

// TODO: use @react-pdf/renderer to dynamically generate PDF previews on the client
// https://react-pdf.org/repl

const CertificationsClientComponent = dynamic(() => import('./CertificationsClientComponent'), {
	ssr: false,
	loading: () => <ResponsiveResumeBuilder desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />
});

const DashboardHeaderClientComponent = dynamic(() => import('@/components/layout/DashboardHeaderClientComponent'), {
	ssr: false,
	loading() {
		return <DashboardHeaderSkeleton />;
	}
});

const ResumeProgressClientComponent = dynamic(() => import('@/components/resume-builder/ResumeProgressClientComponent'), {
	ssr: false,
	loading: () => <ResumeProgressSkeleton />
});

export default function CertificationsPage() {
	return (
		<div className='w-full h-full flex flex-col bg-background-600'>
			<DashboardHeaderClientComponent />
			<div className='w-full h-full flex flex-1 max-w-7xl mx-auto flex-col-reverse lg:flex-row'>
				<CertificationsClientComponent />
				<ResumeProgressClientComponent />
			</div>
		</div>
	);
}
