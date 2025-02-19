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
	login: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login`,
};

export default links;
