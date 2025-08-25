import { env } from "@/lib/env/client";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: `${env.NEXT_PUBLIC_URL}/`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1.0,
		},
		// add more static pages here
	];

	return [...staticPages];
}
