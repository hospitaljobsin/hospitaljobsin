import type { pageOrganizationDetailMetadataFragment$key } from '@/__generated__/pageOrganizationDetailMetadataFragment.graphql';
import type OrganizationDetailMetadataQueryNode from '@/__generated__/pageOrganizationDetailMetadataQuery.graphql';
import type { pageOrganizationDetailMetadataQuery } from '@/__generated__/pageOrganizationDetailMetadataQuery.graphql';
import type { pageOrganizationDetailServerFragment$key } from '@/__generated__/pageOrganizationDetailServerFragment.graphql';
import type OrganizationDetailViewQueryNode from '@/__generated__/pageOrganizationDetailViewQuery.graphql';
import type { pageOrganizationDetailViewQuery } from '@/__generated__/pageOrganizationDetailViewQuery.graphql';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';
import { notFound } from 'next/navigation';
import { graphql, readInlineData } from 'relay-runtime';
import OrganizationDetailViewClientComponent from './OrganizationDetailViewClientComponent';

export const PageOrganizationDetailViewQuery = graphql`
  query pageOrganizationDetailViewQuery($slug: String!) {
	...pageOrganizationDetailServerFragment @arguments(slug: $slug)
    ...OrganizationDetailViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageOrganizationDetailServerFragment = graphql`
 fragment pageOrganizationDetailServerFragment on Query @inline @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
	organization(slug: $slug) {
	  __typename
	  ... on Organization {
		__typename
	  }

	}
  }
`;

export const PageOrganizationDetailMetadataQuery = graphql`
  query pageOrganizationDetailMetadataQuery($slug: String!) {
	...pageOrganizationDetailMetadataFragment @arguments(slug: $slug)
  }
`;

const PageOrganizationDetailMetadataFragment = graphql`
 fragment pageOrganizationDetailMetadataFragment on Query @inline @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
	organization(slug: $slug) {
	  __typename
	  ... on Organization {
		name
		description
		bannerUrl
	  }

	}
  }
`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const slug = (await params).slug;
	const preloadedQuery = await loadSerializableQuery<typeof OrganizationDetailMetadataQueryNode, pageOrganizationDetailMetadataQuery>(
		PageOrganizationDetailMetadataQuery,
		{
			slug: slug
		},
		{
			metadata: {
				options: {
					cache: 'force-cache',
					next: {
						revalidate: false,
						tags: [`organization:${slug}`] // invalidate this cache when organization metadata is updated
					}
				}
			}
		}
	);

	const data = readInlineData<pageOrganizationDetailMetadataFragment$key>(PageOrganizationDetailMetadataFragment, preloadedQuery.data);

	if (data.organization.__typename !== 'Organization') {
		return {
			title: 'Organization Not found',
			description: 'The organization you are looking for does not exist',
			robots: {
				index: false,
				follow: false
			},
			alternates: {
				canonical: `${env.NEXT_PUBLIC_URL}${links.organizationDetail(slug)}`
			}
		};
	}

	return {
		title: data.organization.name,
		description: data.organization.description,
		openGraph: {
			images: [
				{
					url: data.organization.bannerUrl,
					width: 1200,
					height: 630,
					alt: data.organization.name,
					type: 'image/png'
				}
			]
		},
		robots: {
			index: true,
			follow: true
		},
		alternates: {
			canonical: `${env.NEXT_PUBLIC_URL}${links.organizationDetail(slug)}`
		}
	};
}

export default async function OrganizationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const slug = (await params).slug;

	const preloadedQuery = await loadSerializableQuery<typeof OrganizationDetailViewQueryNode, pageOrganizationDetailViewQuery>(
		PageOrganizationDetailViewQuery,
		{
			slug: slug
		},
		{
			metadata: {
				options: {
					cache: 'force-cache',
					next: {
						revalidate: false,
						tags: [`organization:${slug}`] // invalidate this cache when organization members are updated
					}
				}
			}
		}
	);

	const data = readInlineData<pageOrganizationDetailServerFragment$key>(PageOrganizationDetailServerFragment, preloadedQuery.data);

	if (data.organization.__typename !== 'Organization') {
		notFound();
	}

	return <OrganizationDetailViewClientComponent preloadedQuery={preloadedQuery} slug={slug} />;
}
