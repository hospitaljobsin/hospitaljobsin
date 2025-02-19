import { env } from "./env";

const links = {
	landing: "/",
	createOrganization: "/new-organization",
	login: `${env.NEXT_PUBLIC_ACCOUNTS_BASE_URL}/auth/login`,
};

export default links;
