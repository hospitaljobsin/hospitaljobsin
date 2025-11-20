import type { MetadataRoute } from 'next';
import { fetchQuery, graphql } from 'relay-runtime';
import type { sitemapJobsQuery as sitemapJobsType } from '@/__generated__/sitemapJobsQuery.graphql';
import type { sitemapOrganizationsQuery as SiteMapOrganizationQueryType } from '@/__generated__/sitemapOrganizationsQuery.graphql';
import { fetchPosts } from '@/lib/cms';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import { getCurrentEnvironment } from '@/lib/relay/environments';
import type { PayloadPost } from '@/types/payload';

export const dynamic = 'force-dynamic';

export const dynamicParams = true;

export const revalidate = 86400; // Revalidate once a day

export const SitemapJobsQuery = graphql`
  query sitemapJobsQuery($cursor: ID, $count: Int!) {
    jobs(after: $cursor, first: $count, workMode: [], jobType: []) {
      edges {
        node {
          id
          slug
          createdAt
          updatedAt
          organization @required(action: THROW) {
            slug
            name
            bannerUrl
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const SiteMapOrganizationQuery = graphql`
  query sitemapOrganizationsQuery($cursor: ID, $count: Int!) {
    organizations(after: $cursor, first: $count) {
      edges {
        node {
          slug
          name
          bannerUrl
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const LOCATIONS = [
	'Chennai',
	'Tamil Nadu',
	'Trichy',
	'Alwarpet',
	'Vadapalani',
	'Madipakkam',
	'Nungambakkam',
	'Thiruvallur',
	'Madurai',
	'Thanjavur',
	'Delhi',
	'West Bengal'
];

const SPECIALITIES = [
	'Ambulance Driver',
	'Nurse',
	'Staff Nurse',
	'Front Office Executive',
	'Lab Technician',
	'Guest Relations',
	'Manager On Duty',
	'Radiographer',
	'Pharmacist',
	'Fitness Trainer',
	'Nutritionist',
	'Physician',
	'Biomedical Engineer',
	'Dental Surgeon',
	'Radiologist'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: `${env.NEXT_PUBLIC_URL}${links.landing}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0
		},
		{
			url: `${env.NEXT_PUBLIC_URL}${links.search()}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0
		},
		{
			url: `${env.NEXT_PUBLIC_URL}${links.faq}`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6
		},
		{
			url: `${env.NEXT_PUBLIC_URL}${links.blog}`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8
		}
		// add more static pages here
	];
	if (env.NEXT_PUBLIC_ENVIRONMENT !== 'production') {
		// only create sitemap for static pages in non-production environments
		return staticPages;
	}
	const jobs = await genJobsSitemap();
	const organizations = await genOrganizationsSitemap();
	const blogPosts = await genBlogPostsSitemap();

	const searchLocations = genSearchLocationsSitemap();
	const searchMapLocations = genSearchLocationsMapSitemap();
	const searchSpecialities = genSearchSpecialitiesSitemap();
	const searchMapSpecialities = genSearchSpecialitiesMapSitemap();

	return [
		...staticPages,
		...jobs,
		...organizations,
		...blogPosts,
		...searchLocations,
		...searchMapLocations,
		...searchSpecialities,
		...searchMapSpecialities
	];
}

async function genJobsSitemap(): Promise<MetadataRoute.Sitemap> {
	const environment = getCurrentEnvironment();
	const allJobs: Array<{
		id: string;
		slug: string;
		createdAt: string;
		updatedAt: string;
		organization: {
			slug: string;
			name: string;
			bannerUrl: string;
		};
	}> = [];
	let cursor: string | null = null;
	let hasNextPage = true;
	const batchSize = 100;

	// Fetch all jobs using cursor-based pagination
	while (hasNextPage) {
		console.log('fetching jobs', cursor);
		try {
			const data = await fetchQuery<sitemapJobsType>(environment, SitemapJobsQuery, {
				cursor: cursor ?? undefined,
				count: batchSize
			}).toPromise();

			if (!data?.jobs) {
				break;
			}

			// Add jobs from this batch
			const jobs = data.jobs.edges.map(edge => edge.node);
			allJobs.push(...jobs);

			// Update pagination state
			hasNextPage = data.jobs.pageInfo.hasNextPage;
			cursor = data.jobs.pageInfo.endCursor ?? null;
		} catch (error) {
			console.error('error fetching jobs', error);
			break;
		}
	}

	return allJobs.map(job => ({
		url: `${env.NEXT_PUBLIC_URL}${links.jobDetail(job.organization.slug, job.slug)}`,
		lastModified: new Date(job.updatedAt),
		changeFrequency: 'weekly',
		priority: 0.8,
		images: [job.organization.bannerUrl]
	}));
}

async function genOrganizationsSitemap(): Promise<MetadataRoute.Sitemap> {
	const environment = getCurrentEnvironment();
	const allOrganizations: Array<{
		slug: string;
		name: string;
		bannerUrl: string;
		createdAt: string;
	}> = [];
	let cursor: string | null = null;
	let hasNextPage = true;
	const batchSize = 100;

	// Fetch all jobs using cursor-based pagination
	while (hasNextPage) {
		const data = await fetchQuery<SiteMapOrganizationQueryType>(environment, SiteMapOrganizationQuery, {
			cursor: cursor ?? undefined,
			count: batchSize
		}).toPromise();

		if (!data?.organizations) {
			break;
		}

		// Add jobs from this batch
		const organizations = data.organizations.edges.map(edge => edge.node);
		allOrganizations.push(...organizations);

		// Update pagination state
		hasNextPage = data.organizations.pageInfo.hasNextPage;
		cursor = data.organizations.pageInfo.endCursor ?? null;
	}

	return allOrganizations.map(organization => ({
		url: `${env.NEXT_PUBLIC_URL}${links.organizationDetail(organization.slug)}`,
		lastModified: new Date(organization.createdAt),
		changeFrequency: 'weekly',
		priority: 0.7,
		images: [organization.bannerUrl]
	}));
}

async function genBlogPostsSitemap(): Promise<MetadataRoute.Sitemap> {
	const allBlogPosts: PayloadPost[] = [];
	let currentPage = 1;
	let hasNextPage = true;
	const limit = 100;

	// Fetch all blog posts using page-based pagination
	while (hasNextPage) {
		console.log('fetching blog posts', currentPage);
		try {
			const data = await fetchPosts({
				limit,
				page: currentPage
			});

			if (!data?.docs || data.docs.length === 0) {
				break;
			}

			// Add posts from this batch
			allBlogPosts.push(...data.docs);

			// Update pagination state
			hasNextPage = data.hasNextPage;
			currentPage += 1;
		} catch (error) {
			console.error('error fetching blog posts', error);
			break;
		}
	}

	return allBlogPosts.map(post => ({
		url: `${env.NEXT_PUBLIC_URL}${links.blogDetail(post.slug)}`,
		// Use updatedAt if available, otherwise fall back to publishedAt
		lastModified: post.updatedAt ? new Date(post.updatedAt) : post.publishedAt ? new Date(post.publishedAt) : new Date(),
		changeFrequency: 'weekly' as const,
		priority: 0.7,
		images: post.heroImage?.url ? [post.heroImage.url] : []
	}));
}

function genSearchLocationsSitemap(): MetadataRoute.Sitemap {
	return LOCATIONS.map(location => ({
		url: `${env.NEXT_PUBLIC_URL}${links.search(location)}`,
		lastModified: new Date(),
		changeFrequency: 'weekly',
		priority: 0.9,
		images: []
	}));
}

function genSearchLocationsMapSitemap(): MetadataRoute.Sitemap {
	return LOCATIONS.map(location => ({
		url: `${env.NEXT_PUBLIC_URL}${links.searchMap(location)}`,
		lastModified: new Date(),
		changeFrequency: 'weekly',
		priority: 0.9,
		images: []
	}));
}

function genSearchSpecialitiesSitemap(): MetadataRoute.Sitemap {
	return SPECIALITIES.map(speciality => ({
		url: `${env.NEXT_PUBLIC_URL}${links.search(undefined, speciality)}`,
		lastModified: new Date(),
		changeFrequency: 'weekly',
		priority: 0.9,
		images: []
	}));
}

function genSearchSpecialitiesMapSitemap(): MetadataRoute.Sitemap {
	return SPECIALITIES.map(speciality => ({
		url: `${env.NEXT_PUBLIC_URL}${links.searchMap(undefined, speciality)}`,
		lastModified: new Date(),
		changeFrequency: 'weekly',
		priority: 0.9,
		images: []
	}));
}
