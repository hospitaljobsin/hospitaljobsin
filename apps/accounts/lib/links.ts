import { env } from "./env/client";

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
	settingsPasskeys: "/settings/passkeys",
	settingsSessions: "/settings/sessions",
	requestSudo: (returnTo: string | null = null) =>
		returnTo ? `/request-sudo?return_to=${returnTo}` : "/request-sudo",
	twoFactorAuthentication: (returnTo: string | null = null) =>
		returnTo ? `/auth/2fa?return_to=${returnTo}` : "/auth/2fa",
	twoFactorRecovery: (returnTo: string | null = null) =>
		returnTo
			? `/auth/2fa/recovery?return_to=${returnTo}`
			: "/auth/2fa/recovery",
	terms: `${env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL}/terms`,
	privacy: `${env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL}/privacy`,
};

export default links;
