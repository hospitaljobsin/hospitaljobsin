import { env } from "@/lib/env/client";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: ["/"],
			disallow: ["/profile", "/saved", "/applied", "/api/health"],
		},
		sitemap: `${env.NEXT_PUBLIC_URL}/sitemap.xml`,
	};
}
