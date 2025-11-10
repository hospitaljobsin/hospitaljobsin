import type { MetadataRoute } from 'next';
import { env } from '@/lib/env/client';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: ['/'],
			disallow: ['/profile', '/saved', '/applied', '/api/health', '/blog-preview/*']
		},
		sitemap: `${env.NEXT_PUBLIC_URL}/sitemap.xml`
	};
}
