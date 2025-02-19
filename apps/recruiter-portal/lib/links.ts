import { env } from "./env";

const links = {
	landing: "/",
	createOrganization: "/new-organization",
	login: (returnTo: string | undefined = undefined) =>
		returnTo
			? `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login?return_to=${returnTo}`
			: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login`,
};

export default links;
