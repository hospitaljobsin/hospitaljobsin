import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: ["/", "/auth/signup", "/auth/login", "/auth/reset-password"],
			disallow: ["/api/health", "/settings", "/settings/*", "/2fa"],
		},
	};
}
