'use client';
import JobApplyViewSkeleton from '@/components/job-apply/JobApplyViewSkeleton';
import dynamic from 'next/dynamic';
import { use } from 'react';

const JobApplyViewClientComponent = dynamic(() => import('./JobApplyViewClientComponent'), {
	ssr: false,
	loading: () => <JobApplyViewSkeleton />
});

export default function JobApplyPage({ params }: { params: Promise<{ slug: string; jobSlug: string }> }) {
	const { slug, jobSlug } = use(params);
	return <JobApplyViewClientComponent slug={slug} jobSlug={jobSlug} />;
}
