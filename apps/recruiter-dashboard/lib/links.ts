import { env } from "./env/client";

const protocol =
	env.NEXT_PUBLIC_ENVIRONMENT === "production" ? "https" : "http";

const links = {
	landing: "/",
	dashboard: "/dashboard",
	createOrganization: `${env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}/new`,
	organizationDetail: (slug: string) =>
		`${protocol}://${slug}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
	organizationJobDetail: (jobSlug: string) => `/jobs/${jobSlug}`,
	organizationDetailMembers: (slug: string) =>
		`/dashboard/organizations/${slug}/members`,
	organizationDetailMemberInvites: (slug: string) =>
		`/dashboard/organizations/${slug}/members/invites`,
	organizationDetailJobs: (slug: string) =>
		`/dashboard/organizations/${slug}/jobs`,
	organizationCreateJob: "/new-job",
	organizationDetailSettings: (slug: string) =>
		`/dashboard/organizations/${slug}/settings`,
	jobDetailSettingsApplicationForm: (
		organizationSlug: string,
		jobSlug: string,
	) =>
		`/dashboard/organizations/${organizationSlug}/jobs/${jobSlug}/settings/application-form`,
	jobDetailSettings: (organizationSlug: string, jobSlug: string) =>
		`/dashboard/organizations/${organizationSlug}/jobs/${jobSlug}/settings`,
	jobDetailApplicants: (organizationSlug: string, jobSlug: string) =>
		`/dashboard/organizations/${organizationSlug}/jobs/${jobSlug}/applicants`,
	applicantDetail: (
		organizationSlug: string,
		jobSlug: string,
		applicantSlug: string,
	) =>
		`/dashboard/organizations/${organizationSlug}/jobs/${jobSlug}/applicants/${applicantSlug}`,
	login: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login`,
	signup: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/signup?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/signup`,
	accountSettings: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/settings`,
	accountSettingsRequestSudo: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/request-sudo?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/request-sudo`,
	terms: `${env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}/terms`,
	privacy: `${env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}/privacy`,
};

export default links;
