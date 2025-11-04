import type { Metadata } from 'next';
import FAQContent from '@/components/faq/FAQContent';

export const metadata: Metadata = {
	title: 'FAQ Guide for Job Seekers & Employers | Hospital Jobs',
	description:
		'Explore our FAQ section to learn how HospitalJobs.in helps job seekers apply for hospital jobs and recruiters post verified openings. Simple, secure, and AI-powered for healthcare hiring in India.'
};

export default function FAQPage() {
	return (
		<div className='w-full min-h-screen bg-background-200'>
			<div className='w-full px-5 max-w-7xl mx-auto py-12'>
				<h1 className='text-3xl font-medium text-foreground-900 mb-2'>Frequently Asked Questions</h1>
				<p className='text-foreground-600 mb-10'>
					Find answers to common questions about using HospitalJobs.in for job seeking and recruitment.
				</p>
				<FAQContent />
			</div>
		</div>
	);
}
