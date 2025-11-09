import { env } from './env/client';

const links = {
	landing: '/',
	faq: '/faq',
	blogDetail: (slug: string) => `/blog/${slug}`,
	search: (location: string | undefined = undefined, speciality: string | undefined = undefined) =>
		location && speciality
			? `/search/${speciality.trim().replace(/\s+/g, '-')}-jobs-in-${location.trim().replace(/\s+/g, '-')}`
			: location
				? `/search/jobs-in-${location.trim().replace(/\s+/g, '-')}`
				: speciality
					? `/search/${speciality.trim().replace(/\s+/g, '-')}-jobs`
					: '/search',
	searchMap: (location: string | undefined = undefined, speciality: string | undefined = undefined) =>
		location && speciality
			? `/search/map/${speciality.trim().replace(/\s+/g, '-')}-jobs-in-${location.trim().replace(/\s+/g, '-')}`
			: location
				? `/search/map/jobs-in-${location.trim().replace(/\s+/g, '-')}`
				: speciality
					? `/search/map/${speciality.trim().replace(/\s+/g, '-')}-jobs`
					: '/search/map',
	recruiterLanding: `${env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}/`,
	profile: '/profile',
	resumeBuilder: '/resume-builder',
	resumeBuilderResume: '/resume-builder/resume',
	resumeBuilderPersonalInfo: '/resume-builder/personal-info',
	resumeBuilderIntroduction: '/resume-builder/introduction',
	resumeBuilderCareerProfile: '/resume-builder/career-profile',
	resumeBuilderWorkExperience: '/resume-builder/work-experience',
	resumeBuilderEducation: '/resume-builder/education',
	resumeBuilderCertifications: '/resume-builder/certifications',
	resumeBuilderLicenses: '/resume-builder/licenses',
	resumeBuilderLanguages: '/resume-builder/languages',
	savedJobs: '/saved',
	appliedJobs: '/applied',
	jobAlerts: '/my-alerts',
	organizations: '/organizations',
	jobDetail: (slug: string, jobSlug: string) => `/organizations/${slug}/jobs/${jobSlug}`,
	organizationDetail: (slug: string) => `/organizations/${slug}`,
	organizationDetailSettings: (slug: string) => `/organizations/${slug}/settings`,
	login: (returnTo: string | undefined = undefined) =>
		returnTo ? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login?return_to=${returnTo}` : `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login`,
	accountSettings: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/settings`,
	twoFactorAuthentication: (returnTo: string | null = null) =>
		returnTo ? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/2fa?return_to=${returnTo}` : `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/2fa`,
	terms: '/terms',
	privacy: '/privacy',
	requestSudo: (returnTo: string) => `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/request-sudo?return_to=${encodeURIComponent(returnTo)}`
};

export default links;
