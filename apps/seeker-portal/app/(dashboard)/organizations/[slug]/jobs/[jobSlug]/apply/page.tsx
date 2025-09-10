import type { pageJobApplyServerFragment$key } from '@/__generated__/pageJobApplyServerFragment.graphql';
import type JobApplyViewQueryNode from '@/__generated__/pageJobApplyViewQuery.graphql';
import type { pageJobApplyViewQuery } from '@/__generated__/pageJobApplyViewQuery.graphql';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';
import { notFound } from 'next/navigation';
import { graphql, readInlineData } from 'relay-runtime';
import JobApplyViewClientComponent from './JobApplyViewClientComponent';

export const PageJobApplyViewQuery = graphql`
  query pageJobApplyViewQuery($slug: String!, $jobSlug: String!) {
    ...pageJobApplyServerFragment @arguments(slug: $slug, jobSlug: $jobSlug)
    ...JobApplyViewClientComponentFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

const PageJobApplyServerFragment = graphql`
 fragment pageJobApplyServerFragment on Query @inline @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) {
		viewer {
			__typename
			... on Account {
				profile {
					isComplete
				}
			}
		}
		organization(slug: $slug) {
			__typename
			... on Organization {
				bannerUrl
				job(slug: $jobSlug) {
				__typename
				... on Job {
					title
					description
					isApplied
					externalApplicationUrl
					isVisible
				}

				}
			}
		}

  }
`;

export default async function JobApplyPage({ params }: { params: Promise<{ slug: string; jobSlug: string }> }) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);
	const jobSlug = decodeURIComponent(pathParams.jobSlug);

	const preloadedQuery = await loadSerializableQuery<typeof JobApplyViewQueryNode, pageJobApplyViewQuery>(PageJobApplyViewQuery, {
		slug: slug,
		jobSlug: jobSlug
	});

	const data = readInlineData<pageJobApplyServerFragment$key>(PageJobApplyServerFragment, preloadedQuery.data);

	// only users who have not applied can access this page
	if (
		data.organization.__typename !== 'Organization' ||
		data.organization.job.__typename !== 'Job' ||
		!data.organization.job.isVisible ||
		data.organization.job.isApplied ||
		data.organization.job.externalApplicationUrl !== null ||
		data.viewer.__typename !== 'Account' ||
		!data.viewer.profile?.isComplete
	) {
		notFound();
	}

	return <JobApplyViewClientComponent preloadedQuery={preloadedQuery} />;
}
