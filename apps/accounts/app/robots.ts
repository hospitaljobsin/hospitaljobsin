import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: ["/"],
			disallow: [
				"/auth/signup",
				"/auth/login",
				"/auth/reset-password",
				"/auth/reset-password/*",
				"/auth/2fa",
				"/auth/2fa/*",
				"/settings",
				"/settings/*",
				"/request-sudo",
				"/api/health",
			],
		},
	};
}
