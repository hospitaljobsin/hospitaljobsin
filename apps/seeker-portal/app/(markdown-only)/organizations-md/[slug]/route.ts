import { notFound } from 'next/navigation';
import { graphql, readInlineData } from 'relay-runtime';
import type { routeOrganizationMarkdownFragment$key } from '@/__generated__/routeOrganizationMarkdownFragment.graphql';
import type RouteOrganizationMarkdownQueryNode from '@/__generated__/routeOrganizationMarkdownQuery.graphql';
import type { routeOrganizationMarkdownQuery } from '@/__generated__/routeOrganizationMarkdownQuery.graphql';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';

const RouteOrganizationMarkdownQuery = graphql`
  query routeOrganizationMarkdownQuery($slug: String!) {
	...routeOrganizationMarkdownFragment @arguments(slug: $slug)
  }
`;

const RouteOrganizationMarkdownFragment = graphql`
 fragment routeOrganizationMarkdownFragment on Query @inline @argumentDefinitions(
      slug: { type: "String!"}
    ) {
		organization(slug: $slug) {
			__typename
			... on Organization {
			name
			location
			website
			email
			descriptionCleaned
			verificationStatus {
				__typename
				... on Verified @alias(as: "verified") {
					verifiedAt
				}
			}
		}
	}
  }
`;

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);

	const preloadedQuery = await loadSerializableQuery<typeof RouteOrganizationMarkdownQueryNode, routeOrganizationMarkdownQuery>(
		RouteOrganizationMarkdownQuery,
		{ slug },
		{
			metadata: {
				options: {
					cache: 'force-cache',
					next: {
						revalidate: 60 * 60,
						tags: [`organization:${slug}`]
					}
				}
			}
		}
	);

	const data = readInlineData<routeOrganizationMarkdownFragment$key>(RouteOrganizationMarkdownFragment, preloadedQuery.data);

	if (data.organization.__typename !== 'Organization') {
		notFound();
	}

	const org = data.organization;
	const orgDetailUrl = `${env.NEXT_PUBLIC_URL}${links.organizationDetail(slug)}`;

	const markdown = `Title: ${org.name}

URL Source: ${orgDetailUrl}

Markdown Content:
[](${env.NEXT_PUBLIC_URL} "Visit ${APP_NAME} home page")

# Organization Name
${org.name}${org.verificationStatus.verified ? ' ✓' : ''}

## Contact Information

- **Location:** ${org.location || 'Not specified'}
- **Email:** ${org.email || 'Not specified'}
- **Website:** ${org.website ? `[${org.website}](${org.website})` : 'Not specified'}

## About the Organization

${org.descriptionCleaned || 'No description available'}
`;

	return new Response(markdown, {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
	});
}
