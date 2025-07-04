import { env } from "./env/client";

const links = {
	landing: "/",
	search: "/search",
	recruiterLanding: `${env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}/`,
	profile: "/profile",
	savedJobs: "/saved",
	appliedJobs: "/applied",
	jobDetail: (slug: string, jobSlug: string) =>
		`/organizations/${slug}/jobs/${jobSlug}`,
	jobDetailApply: (slug: string, jobSlug: string) =>
		`/organizations/${slug}/jobs/${jobSlug}/apply`,
	organizationDetail: (slug: string) => `/organizations/${slug}`,
	organizationDetailMembers: (slug: string) => `/organizations/${slug}/members`,
	organizationDetailSettings: (slug: string) =>
		`/organizations/${slug}/settings`,
	login: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login`,
	accountSettings: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/settings`,
	terms: "/terms",
	privacy: "/privacy",
};

export default links;
