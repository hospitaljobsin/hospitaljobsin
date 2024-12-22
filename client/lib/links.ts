const links = {
	landing: "/",
	profile: "/profile",
	savedJobs: "/saved",
	jobDetail: (slug: string) => `/jobs/${slug}`,
	companyDetail: (slug: string) => `/companies/${slug}`,
	login: "/auth/login",
	signup: "/auth/signup",
	confirmSignup: "/auth/confirm-signup",
	resetPasswordSubmit: "/auth/reset-password/submit",
	resetPasswordConfirm: "/auth/reset-password/confirm",
};

export default links;
