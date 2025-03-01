import { env } from "./env";

const links = {
	seekerLanding: `${env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL}/`,
	recruiterLanding: `${env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}/`,
	login: (returnTo: string | null = null) =>
		returnTo ? `/auth/login?return_to=${returnTo}` : "/auth/login",
	signup: (returnTo: string | null = null) =>
		returnTo ? `/auth/signup?return_to=${returnTo}` : "/auth/signup",
	resetPasswordSubmit: "/auth/reset-password",
	resetPasswordConfirm: (token: string) => `/auth/reset-password/${token}`,
	settings: "/settings",
	requestSudo: (returnTo: string | null = null) =>
		returnTo ? `/request-sudo?return_to=${returnTo}` : "/request-sudo",
};

export default links;
