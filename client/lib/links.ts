const links = {
	landing: "/",
	profile: "/profile",
	savedJobs: "/saved",
	jobDetail: (slug: string) => `/jobs/${slug}`,
	organizationDetail: (slug: string) => `/organizations/${slug}`,
	organizationDetailMembers: (slug: string) => `/organizations/${slug}/members`,
	createOrganization: "/new-organization",
	login: "/auth/login",
	signup: "/auth/signup",
	resetPasswordSubmit: "/auth/reset-password",
	resetPasswordConfirm: (token: string) => `/auth/reset-password/${token}`,
};

export default links;
