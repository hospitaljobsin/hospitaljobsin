import { env } from "./env/client";

const protocol =
	env.NEXT_PUBLIC_ENVIRONMENT === "production" ? "https" : "http";

const links = {
	landing: env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL,
	recruiterPortalSelect: `${env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}/select`,
	dashboard: "/",
	createOrganization: `${env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}/new`,
	organizationDetail: (slug: string) =>
		`${protocol}://${slug}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
	jobDetailAnalytics: (jobSlug: string) => `/jobs/${jobSlug}/analytics`,
	organizationDetailMembers: "/settings/members",
	organizationDetailMemberInvites: "/settings/invites",
	organizationDetailVerification: "/settings/verification",
	organizationCreateJob: "/new-job",
	organizationDetailSettings: "/settings",
	jobDetailSettingsApplicationForm: (jobSlug: string) =>
		`/jobs/${jobSlug}/settings/application-form`,
	jobDetailSettings: (jobSlug: string) => `/jobs/${jobSlug}/settings`,
	jobDetailApplicants: (jobSlug: string) => `/jobs/${jobSlug}`,
	applicantDetail: (jobSlug: string, applicantSlug: string) =>
		`/jobs/${jobSlug}/applicants/${applicantSlug}`,
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
	terms: `${env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL}/terms`,
	privacy: `${env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL}/privacy`,
	aiGenerateJob: `${env.NEXT_PUBLIC_API_URL}/api/ai/generate-job`,
	aiGenerateJobStatus: (kickoffId: string) =>
		`${env.NEXT_PUBLIC_API_URL}/api/ai/generate-job/status/${kickoffId}`,
};

export default links;
