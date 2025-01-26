const links = {
	landing: "/",
	profile: "/profile",
	savedJobs: "/saved",
	jobDetail: (slug: string) => `/jobs/${slug}`,
	companyDetail: (slug: string) => `/companies/${slug}`,
	login: "/auth/login",
	signup: "/auth/signup",
	resetPasswordSubmit: "/auth/reset-password",
	resetPasswordConfirm: (token: string) => `/auth/reset-password/${token}`,
};

export default links;
