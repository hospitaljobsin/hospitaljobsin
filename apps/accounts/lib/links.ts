import { env } from "./env";

const links = {
	seekerLanding: `${env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL}/`,
	recruiterLanding: `${env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}/`,
	login: "/auth/login",
	signup: "/auth/signup",
	resetPasswordSubmit: "/auth/reset-password",
	resetPasswordConfirm: (token: string) => `/auth/reset-password/${token}`,
};

export default links;
