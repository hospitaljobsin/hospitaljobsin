import { env } from "./env/client";

const protocol =
	env.NEXT_PUBLIC_ENVIRONMENT === "production" ? "https" : "http";

const links = {
	landing: "/",
	createOrganization: "/new",
	login: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login`,
	signup: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/signup?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/signup`,
	organizationDetail: (slug: string) =>
		`${protocol}://${slug}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
	accountSettings: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/settings`,
	accountSettingsRequestSudo: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/request-sudo?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/request-sudo`,
	terms: "/terms",
	privacy: "/privacy",
};

export default links;
