import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: [
				"/",
				"/search",
				"/terms",
				"/privacy",
				"/organizations/",
				"/organizations/*/jobs/",
			],
			disallow: ["/profile", "/saved", "/applied", "/api/health"],
		},
	};
}
