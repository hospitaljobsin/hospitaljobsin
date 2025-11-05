import { notFound } from 'next/navigation';
import { graphql, readInlineData } from 'relay-runtime';
import type { routeSearchMarkdownFragment$key } from '@/__generated__/routeSearchMarkdownFragment.graphql';
import type RouteSearchMarkdownQueryNode from '@/__generated__/routeSearchMarkdownQuery.graphql';
import type { routeSearchMarkdownQuery } from '@/__generated__/routeSearchMarkdownQuery.graphql';
import { isValidBase64Cursor } from '@/lib/cursor';
import { env } from '@/lib/env/client';
import { dateFormat, salaryFormat } from '@/lib/intl';
import links from '@/lib/links';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';
import { parseSearchParams } from '@/lib/searchParams';

const RouteSearchMarkdownQuery = graphql`
  query routeSearchMarkdownQuery(
		$after: ID
		$searchTerm: String
		$minExperience: Int
		$minSalary: Int
		$maxSalary: Int
		$proximityKm: Float
		$location: String
		$workMode: [JobWorkModeFilter!]!
		$jobType: [JobTypeFilter!]!
		$sortBy: JobSearchSortBy!
	) {
	...routeSearchMarkdownFragment @arguments(
		after: $after
		searchTerm: $searchTerm
		minExperience: $minExperience
		minSalary: $minSalary
		maxSalary: $maxSalary
		proximityKm: $proximityKm
		location: $location
		workMode: $workMode
		jobType: $jobType
		sortBy: $sortBy
	)
  }
`;

const RouteSearchMarkdownFragment = graphql`
 fragment routeSearchMarkdownFragment on Query @inline @argumentDefinitions(
		after: { type: "ID" }
		searchTerm: { type: "String" }
		minExperience: { type: "Int" }
		minSalary: { type: "Int" }
		maxSalary: { type: "Int" }
		proximityKm: { type: "Float" }
		location: { type: "String" }
		workMode: { type: "[JobWorkModeFilter!]!" }
		jobType: { type: "[JobTypeFilter!]!" }
		sortBy: { type: "JobSearchSortBy!" }
    ) {
		jobs(after: $after, first: 25, searchTerm: $searchTerm, proximityKm: $proximityKm, minExperience: $minExperience, minSalary: $minSalary, maxSalary: $maxSalary, workMode: $workMode, jobType: $jobType, sortBy: $sortBy, location: $location) {
			totalCount
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					id
					title
					slug
					location
					type
					workMode
					minSalary
					maxSalary
					currency
					minExperience
					maxExperience
					createdAt
					organization {
						name
						slug
					}
				}
			}
		}
	}
`;

function formatJobType(type: string): string {
	const types: Record<string, string> = {
		CONTRACT: 'Contract',
		FULL_TIME: 'Full Time',
		INTERNSHIP: 'Internship',
		PART_TIME: 'Part Time',
		LOCUM: 'Locum'
	};
	return types[type] || type;
}

function formatWorkMode(mode: string): string {
	const modes: Record<string, string> = { HYBRID: 'Hybrid', OFFICE: 'Office', REMOTE: 'Remote' };
	return modes[mode] || mode;
}

function formatSalary(min: number | null, max: number | null, currency: string): string {
	const currencySymbol = currency === 'INR' ? '₹' : currency;
	if (min && max) return `${currencySymbol}${salaryFormat.format(min)} - ${currencySymbol}${salaryFormat.format(max)}`;
	if (min || max) return `${currencySymbol}${salaryFormat.format(min ?? max ?? 0)}`;
	return 'Not disclosed';
}

export async function GET(request: Request, { params }: { params: Promise<{ params?: string[] }> }) {
	const pathParams = await params;
	const segments = pathParams.params || [];
	const url = new URL(request.url);
	const searchParams = Object.fromEntries(url.searchParams.entries());
	const nextPage = searchParams.nextPage && isValidBase64Cursor(searchParams.nextPage) ? searchParams.nextPage : null;

	// Filter out internal params
	const { via_markdown_rewrite, ...publicSearchParams } = searchParams;

	let speciality: string | null = null;
	let location: string | null = null;

	if (segments.length === 0) {
		// /search-md
	} else if (segments.length === 2 && segments[1] === 'jobs') {
		// /search-md/[speciality]/jobs
		speciality = decodeURIComponent(segments[0]).replace(/-/g, ' ');
	} else if (segments.length === 2 && segments[0] === 'jobs-in') {
		// /search-md/jobs-in/[location]
		location = decodeURIComponent(segments[1]).replace(/-/g, ' ');
	} else if (segments.length === 3 && segments[1] === 'jobs-in') {
		// /search-md/[speciality]/jobs-in/[location]
		speciality = decodeURIComponent(segments[0]).replace(/-/g, ' ');
		location = decodeURIComponent(segments[2]).replace(/-/g, ' ');
	} else {
		notFound();
	}

	const variables = parseSearchParams(searchParams);

	const preloadedQuery = await loadSerializableQuery<typeof RouteSearchMarkdownQueryNode, routeSearchMarkdownQuery>(
		RouteSearchMarkdownQuery,
		{ ...variables, after: nextPage, searchTerm: speciality, location },
		{ metadata: { options: { cache: 'no-store' } } }
	);

	const data = readInlineData<routeSearchMarkdownFragment$key>(RouteSearchMarkdownFragment, preloadedQuery.data);

	const searchUrl = `${env.NEXT_PUBLIC_URL}${links.search(location || undefined, speciality || undefined)}`;
	const totalCount = data.jobs.totalCount;
	const hasNextPage = data.jobs.pageInfo.hasNextPage;
	const nextCursor = data.jobs.pageInfo.endCursor;

	let title = `${totalCount} Healthcare Jobs`;
	if (speciality) title = `${totalCount} ${speciality} Jobs`;
	if (location) title += ` in ${location}`;

	const nextPageUrl =
		hasNextPage && nextCursor ? `${searchUrl}?${new URLSearchParams({ ...publicSearchParams, nextPage: nextCursor }).toString()}` : null;

	const markdown = `Title: ${title}

Source URL: ${searchUrl}

Markdown Content:

**Total Jobs Found:** ${totalCount}

**Jobs Per Page:** 25

${nextPageUrl ? `**Next Page:** ${nextPageUrl}` : '**Next Page:** None (last page)'}

---

## Job Listings

${data.jobs.edges.length > 0 ? '' : 'No jobs found.'}

${data.jobs.edges
	.map(({ node: job }, idx) => {
		const jobUrl = `${env.NEXT_PUBLIC_URL}${links.jobDetail(job.organization.slug, job.slug)}`;
		return `### ${idx + 1}. ${job.title}

**Organization:** ${job.organization.name}

**Job Details:**
- Location: ${job.location || 'Not specified'}
- Employment Type: ${job.type ? formatJobType(job.type) : 'Not specified'}
- Work Mode: ${job.workMode ? formatWorkMode(job.workMode) : 'Not specified'}
- Experience Required: ${job.minExperience || job.maxExperience ? `${job.minExperience || 0} - ${job.maxExperience || 0} years` : 'Not specified'}
- Salary Range: ${formatSalary(job.minSalary, job.maxSalary, job.currency)} per month
- Posted Date: ${dateFormat.format(new Date(job.createdAt))}

**Full Job Description:** [View Complete Details](${jobUrl})

---
`;
	})
	.join('\n')}`;

	return new Response(markdown, {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
	});
}
