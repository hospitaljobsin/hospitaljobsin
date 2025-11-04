'use client';

import { Accordion, AccordionItem } from '@heroui/react';
import { SUPPORT_EMAIL } from '@/lib/constants';
import { env } from '@/lib/env/client';

export default function FAQContent() {
	return (
		<>
			<section className='mb-12'>
				<h2 className='text-2xl font-medium text-foreground-800 mb-6'>For Job Seekers</h2>
				<Accordion variant='bordered' selectionMode='multiple'>
					<AccordionItem
						key='what-is-hospitaljobs'
						aria-label='What is HospitalJobs.in and how does it work?'
						title='What is HospitalJobs.in and how does it work?'
					>
						<p className='text-foreground-700'>
							HospitalJobs.in is a specialized job portal connecting healthcare professionals with hospitals and medical facilities across
							India. Simply create a profile, upload your resume, and browse hundreds of verified hospital job openings. You can apply
							directly through the platform and track your applications in real-time.
						</p>
					</AccordionItem>

					<AccordionItem
						key='is-free-for-seekers'
						aria-label='Is HospitalJobs.in free for job seekers?'
						title='Is HospitalJobs.in free for job seekers?'
					>
						<p className='text-foreground-700'>
							Yes, HospitalJobs.in is completely free for job seekers. You can create a profile, search for jobs, apply to unlimited
							positions, and receive job alerts without any charges.
						</p>
					</AccordionItem>

					<AccordionItem
						key='how-to-apply'
						aria-label='How do I apply for a hospital job through the website?'
						title='How do I apply for a hospital job through the website?'
					>
						<p className='text-foreground-700'>
							To apply for a job, first create an account and complete your profile. Then browse or search for jobs that interest you. Click
							on a job listing to view details, and click the "Apply Now" button. Your profile information and resume will be sent directly
							to the recruiter.
						</p>
					</AccordionItem>

					<AccordionItem
						key='upload-resume'
						aria-label='Can I upload my resume or CV directly?'
						title='Can I upload my resume or CV directly?'
					>
						<p className='text-foreground-700'>
							Yes, you can upload your resume in PDF format directly to your profile. This makes it easy to apply for jobs quickly, as your
							resume will be automatically attached to your applications. You can also update your resume anytime from your profile
							settings.
						</p>
					</AccordionItem>

					<AccordionItem
						key='track-applications'
						aria-label='How can I track my job applications?'
						title='How can I track my job applications?'
					>
						<p className='text-foreground-700'>
							You can track all your job applications from the "My Jobs" section in your dashboard. This shows you which jobs you've applied
							to, when you applied, and the current status of each application.
						</p>
					</AccordionItem>

					<AccordionItem
						key='apply-multiple-jobs'
						aria-label='Can I apply for multiple jobs at once?'
						title='Can I apply for multiple jobs at once?'
					>
						<p className='text-foreground-700'>
							Yes, you can apply to as many jobs as you like. Once your profile is complete, applying to additional jobs is quick and easy
							with just a few clicks. We recommend applying to all positions that match your qualifications and interests.
						</p>
					</AccordionItem>

					<AccordionItem
						key='recruiter-contact'
						aria-label='Can recruiters contact me directly through the website?'
						title='Can recruiters contact me directly through the website?'
					>
						<p className='text-foreground-700'>
							Yes, recruiters can view your profile and contact you directly if they find you suitable for their openings. Make sure your
							contact information is up-to-date and your profile is complete to increase your chances of being contacted by recruiters.
						</p>
					</AccordionItem>

					<AccordionItem
						key='job-alerts'
						aria-label='Can I receive job alerts based on my location or role?'
						title='Can I receive job alerts based on my location or role?'
					>
						<p className='text-foreground-700'>
							Yes, you can create customized job alerts based on your preferred job title, location, experience level, salary range, and
							other criteria. You'll receive email notifications when new jobs matching your preferences are posted. You can manage your job
							alerts from the "My Alerts" section.
						</p>
					</AccordionItem>
				</Accordion>
			</section>

			<section>
				<h2 className='text-2xl font-medium text-foreground-800 mb-6'>For Recruiters & Hospitals</h2>
				<Accordion variant='bordered' selectionMode='multiple'>
					<AccordionItem
						key='how-to-post-jobs'
						aria-label='How can hospitals or healthcare recruiters post job openings?'
						title='How can hospitals or healthcare recruiters post job openings?'
					>
						<p className='text-foreground-700'>
							To post job openings, first register as a recruiter and create your organization profile. Once verified, you can access the
							recruitment dashboard where you can create and publish job listings. Each listing allows you to specify job requirements,
							qualifications, salary range, and other details.
						</p>
					</AccordionItem>

					<AccordionItem
						key='cost-to-list'
						aria-label='Is there a cost to list hospital jobs on HospitalJobs.in?'
						title='Is there a cost to list hospital jobs on HospitalJobs.in?'
					>
						<p className='text-foreground-700'>
							Currently, HospitalJobs.in is completely free for recruiters and hospitals. You can post unlimited job openings and access all
							features at no cost. A pricing structure will be introduced in the future.
						</p>
					</AccordionItem>

					<AccordionItem
						key='post-multiple-jobs'
						aria-label='Can I post multiple job openings at once?'
						title='Can I post multiple job openings at once?'
					>
						<p className='text-foreground-700'>Yes, you can post multiple job openings simultaneously from your recruitment dashboard.</p>
					</AccordionItem>

					<AccordionItem
						key='feature-jobs'
						aria-label='Can I feature or highlight my job posts for better visibility?'
						title='Can I feature or highlight my job posts for better visibility?'
					>
						<p className='text-foreground-700'>
							Currently, all job postings receive equal visibility on the platform. Additional features for highlighting jobs may be
							introduced in the future.
						</p>
					</AccordionItem>

					<AccordionItem
						key='check-applications'
						aria-label='How do I check the applications received for a job?'
						title='How do I check the applications received for a job?'
					>
						<p className='text-foreground-700'>
							All applications are visible in your recruitment dashboard. Click on any job posting to view all applicants, their profiles,
							and resumes. You can review applications, shortlist candidates, and track the hiring process all in one place.
						</p>
					</AccordionItem>

					<AccordionItem
						key='download-resumes'
						aria-label='Can I download candidate resumes directly from the platform?'
						title='Can I download candidate resumes directly from the platform?'
					>
						<p className='text-foreground-700'>
							Yes, you can download candidate resumes in PDF format directly from the application details page. This makes it easy to share
							candidate information with your hiring team or keep records for your internal processes.
						</p>
					</AccordionItem>

					<AccordionItem
						key='filter-applicants'
						aria-label='Are there tools to filter or shortlist applicants?'
						title='Are there tools to filter or shortlist applicants?'
					>
						<p className='text-foreground-700'>
							Yes, our recruitment dashboard includes powerful filtering tools. You can filter applicants by experience, qualifications,
							location, and other criteria, via natural language. You can also track candidates through different stages of your hiring
							process.
						</p>
					</AccordionItem>

					<AccordionItem
						key='register-as-employer'
						aria-label='How do I register as an employer or recruiter?'
						title='How do I register as an employer or recruiter?'
					>
						<p className='text-foreground-700'>
							Click on the "For Recruiters" button on the homepage (Or visit https://recruiter.{env.NEXT_PUBLIC_ROOT_DOMAIN}). Fill out the
							registration form with your organization details and contact information.
						</p>
					</AccordionItem>

					<AccordionItem
						key='multiple-hr-access'
						aria-label='Can multiple HR staff access the same hospital account?'
						title='Can multiple HR staff access the same hospital account?'
					>
						<p className='text-foreground-700'>
							You can add team members with different permission levels, allowing your HR team to collaborate on job postings and candidate
							management.
						</p>
					</AccordionItem>

					<AccordionItem
						key='remove-filled-positions'
						aria-label='How can I remove outdated or filled positions?'
						title='How can I remove outdated or filled positions?'
					>
						<p className='text-foreground-700'>
							You can easily close or delete job postings from your recruitment dashboard. Simply navigate to the job listing and click
							"Unpublish". You can optionally provide an expiration date while creating the job.
						</p>
					</AccordionItem>

					<AccordionItem
						key='contact-support'
						aria-label='How do I contact HospitalJobs.in support for help?'
						title='How do I contact HospitalJobs.in support for help?'
					>
						<p className='text-foreground-700'>
							You can reach our support team via email at {SUPPORT_EMAIL}. Our support team is available Monday to Friday, 9 AM to 10 PM
							IST.
						</p>
					</AccordionItem>

					<AccordionItem
						key='verified-seekers'
						aria-label='Are all job seekers verified before applying?'
						title='Are all job seekers verified before applying?'
					>
						<p className='text-foreground-700'>
							We verify email addresses and phone numbers during registration. While we encourage job seekers to complete their profiles
							with accurate information, we recommend that recruiters conduct their own verification of qualifications and credentials
							during the interview process.
						</p>
					</AccordionItem>

					<AccordionItem
						key='promote-hospital-profile'
						aria-label='Can I promote my hospital profile to attract more applicants?'
						title='Can I promote my hospital profile to attract more applicants?'
					>
						<p className='text-foreground-700'>
							Yes, you can create a detailed hospital profile with photos, facilities information, and employee benefits to attract quality
							candidates. Complete profiles appear on our organizations page and help job seekers learn more about your organization.
						</p>
					</AccordionItem>

					<AccordionItem
						key='analytics-insights'
						aria-label='Do you offer analytics or insights for posted jobs?'
						title='Do you offer analytics or insights for posted jobs?'
					>
						<p className='text-foreground-700'>
							Yes, you can track views and applications for your job postings. These insights help you understand job performance and
							optimize your job descriptions and recruitment strategy.
						</p>
					</AccordionItem>
				</Accordion>
			</section>
		</>
	);
}
