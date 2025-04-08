import { env } from "./env";

const links = {
	landing: "/",
	dashboard: "/dashboard",
	createOrganization: "/dashboard/new-organization",
	organizationDetail: (slug: string) => `/dashboard/organizations/${slug}`,
	organizationJobDetail: (organizationSlug: string, jobSlug: string) =>
		`/dashboard/organizations/${organizationSlug}/jobs/${jobSlug}`,
	organizationDetailMembers: (slug: string) =>
		`/dashboard/organizations/${slug}/members`,
	organizationDetailMemberInvites: (slug: string) =>
		`/dashboard/organizations/${slug}/members/invites`,
	organizationDetailJobs: (slug: string) =>
		`/dashboard/organizations/${slug}/jobs`,
	organizationCreateJob: (slug: string) =>
		`/dashboard/organizations/${slug}/new-job`,
	organizationDetailSettings: (slug: string) =>
		`/dashboard/organizations/${slug}/settings`,
	login: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login`,
	accountSettings: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/settings`,
	accountSettingsRequestSudo: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/request-sudo?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/request-sudo`,
	terms: "/terms",
	privacy: "/privacy",
};

export default links;
