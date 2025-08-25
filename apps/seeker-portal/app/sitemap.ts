import type { sitemapJobsQuery as sitemapJobsType } from "@/__generated__/sitemapJobsQuery.graphql";
import type { sitemapOrganizationsQuery as SiteMapOrganizationQueryType } from "@/__generated__/sitemapOrganizationsQuery.graphql";
import { env } from "@/lib/env/client";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import type { MetadataRoute } from "next";
import { fetchQuery, graphql } from "relay-runtime";

export const SitemapJobsQuery = graphql`
  query sitemapJobsQuery($cursor: ID, $count: Int!) {
    jobs(after: $cursor, first: $count) {
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	console.log("sitemap");
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: `${env.NEXT_PUBLIC_URL}/`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${env.NEXT_PUBLIC_URL}/search`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		// add more static pages here
	];
	const jobs = await genJobsSitemap();
	const organizations = await genOrganizationsSitemap();

	console.log("jobs", jobs);
	console.log("organizations", organizations);

	return [...staticPages, ...jobs, ...organizations];
}

async function genJobsSitemap(): Promise<MetadataRoute.Sitemap> {
	const environment = getCurrentEnvironment();
	const allJobs = [];
	let cursor: string | null = null;
	let hasNextPage = true;
	const batchSize = 100;

	// Fetch all jobs using cursor-based pagination
	while (hasNextPage) {
		console.log("fetching jobs", cursor);
		try {
			const data = await fetchQuery<sitemapJobsType>(
				environment,
				SitemapJobsQuery,
				{
					cursor: cursor ?? undefined,
					count: batchSize,
				},
			).toPromise();

			if (!data?.jobs) {
				break;
			}

			// Add jobs from this batch
			const jobs = data.jobs.edges.map((edge) => edge.node);
			allJobs.push(...jobs);

			// Update pagination state
			hasNextPage = data.jobs.pageInfo.hasNextPage;
			cursor = data.jobs.pageInfo.endCursor ?? null;
		} catch (error) {
			console.error("error fetching jobs", error);
			break;
		}
	}

	return allJobs.map((job) => ({
		url: `${env.NEXT_PUBLIC_URL}/organizations/${job.organization.slug}/jobs/${job.slug}`,
		lastModified: new Date(job.updatedAt),
		changeFrequency: "weekly",
		priority: 0.8,
		images: [job.organization.bannerUrl],
	}));
}

async function genOrganizationsSitemap(): Promise<MetadataRoute.Sitemap> {
	const environment = getCurrentEnvironment();
	const allOrganizations = [];
	let cursor: string | null = null;
	let hasNextPage = true;
	const batchSize = 100;

	// Fetch all jobs using cursor-based pagination
	while (hasNextPage) {
		const data = await fetchQuery<SiteMapOrganizationQueryType>(
			environment,
			SiteMapOrganizationQuery,
			{
				cursor: cursor ?? undefined,
				count: batchSize,
			},
		).toPromise();

		if (!data?.organizations) {
			break;
		}

		// Add jobs from this batch
		const organizations = data.organizations.edges.map((edge) => edge.node);
		allOrganizations.push(...organizations);

		// Update pagination state
		hasNextPage = data.organizations.pageInfo.hasNextPage;
		cursor = data.organizations.pageInfo.endCursor ?? null;
	}

	return allOrganizations.map((organization) => ({
		url: `${env.NEXT_PUBLIC_URL}/organizations/${organization.slug}`,
		lastModified: new Date(organization.createdAt),
		changeFrequency: "weekly",
		priority: 0.7,
		images: [organization.bannerUrl],
	}));
}
