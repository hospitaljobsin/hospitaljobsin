import { env } from "./env";

const links = {
	landing: "/",
	profile: "/profile",
	savedJobs: "/saved",
	jobDetail: (slug: string) => `/jobs/${slug}`,
	organizationDetail: (slug: string) => `/organizations/${slug}`,
	organizationDetailMembers: (slug: string) => `/organizations/${slug}/members`,
	organizationDetailSettings: (slug: string) =>
		`/organizations/${slug}/settings`,
	createOrganization: "/new-organization",
	login: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login`,
	signup: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/signup`,
	resetPasswordSubmit: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/reset-password`,
	resetPasswordConfirm: (token: string) =>
		`${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/reset-password/${token}`,
};

export default links;
