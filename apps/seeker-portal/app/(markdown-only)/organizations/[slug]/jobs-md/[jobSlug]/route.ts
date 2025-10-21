import { notFound } from 'next/navigation';
import { graphql, readInlineData } from 'relay-runtime';
import type { routeJobMarkdownFragment$key } from '@/__generated__/routeJobMarkdownFragment.graphql';
import type RouteJobMarkdownQueryNode from '@/__generated__/routeJobMarkdownQuery.graphql';
import type { routeJobMarkdownQuery } from '@/__generated__/routeJobMarkdownQuery.graphql';
import { APP_NAME } from '@/lib/constants';
import { env } from '@/lib/env/client';
import { dateFormat, salaryFormat } from '@/lib/intl';
import links from '@/lib/links';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';

const RouteJobMarkdownQuery = graphql`
  query routeJobMarkdownQuery($slug: String!, $jobSlug: String!) {
	...routeJobMarkdownFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

const RouteJobMarkdownFragment = graphql`
 fragment routeJobMarkdownFragment on Query @inline @argumentDefinitions(
      slug: { type: "String!"}
	  jobSlug: { type: "String!"}
    ) {
		organization(slug: $slug) {
			__typename
			... on Organization {
			name
			location
			website
			descriptionCleaned
			job(slug: $jobSlug) {
			__typename
			... on Job {
				title
				descriptionCleaned
				isVisible
				createdAt
				workMode
				type
				location
				skills
				currency
				minSalary
				maxSalary
				minExperience
				maxExperience
				vacancies
				isSalaryNegotiable
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
	const modes: Record<string, string> = {
		HYBRID: 'Hybrid',
		OFFICE: 'Office',
		REMOTE: 'Remote'
	};
	return modes[mode] || mode;
}

function formatExperience(min: number | null, max: number | null): string {
	if (min && max) return `${min} - ${max} years`;
	if (min) return `Minimum ${min} years`;
	if (max) return `Maximum ${max} years`;
	return 'Not specified';
}

function formatSalary(min: number | null, max: number | null, currency: string, negotiable: boolean): string {
	const currencySymbol = currency === 'INR' ? '₹' : currency;
	if (min && max) {
		const range = `${currencySymbol}${salaryFormat.format(min)} - ${currencySymbol}${salaryFormat.format(max)} / month`;
		return negotiable ? `${range} (Negotiable)` : range;
	}
	if (min || max) {
		return `${currencySymbol}${salaryFormat.format(min ?? max ?? 0)} / month`;
	}
	return 'Not disclosed';
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string; jobSlug: string }> }) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);
	const jobSlug = decodeURIComponent(pathParams.jobSlug);

	const preloadedQuery = await loadSerializableQuery<typeof RouteJobMarkdownQueryNode, routeJobMarkdownQuery>(
		RouteJobMarkdownQuery,
		{ slug, jobSlug },
		{
			metadata: {
				options: {
					cache: 'force-cache',
					next: {
						revalidate: 60 * 60,
						tags: [`job:${slug}:${jobSlug}`, `organization:${slug}`]
					}
				}
			}
		}
	);

	const data = readInlineData<routeJobMarkdownFragment$key>(RouteJobMarkdownFragment, preloadedQuery.data);

	if (data.organization.__typename !== 'Organization' || data.organization.job.__typename !== 'Job' || !data.organization.job.isVisible) {
		notFound();
	}

	const job = data.organization.job;
	const org = data.organization;

	const jobDetailUrl = `${env.NEXT_PUBLIC_URL}${links.jobDetail(slug, jobSlug)}`;
	const orgDetailUrl = `${env.NEXT_PUBLIC_URL}${links.organizationDetail(slug)}`;
	const title = `Job Opening for ${job.title} in ${job.location}`;

	const markdown = `Title: ${title}

URL Source: ${jobDetailUrl}

Markdown Content:
[](${env.NEXT_PUBLIC_URL} "Visit ${APP_NAME} home page")

# Job Title
${job.title}

## Organization
[${org.name}](${orgDetailUrl})${org.location ? ` • ${org.location}` : ''}${org.website ? ` • [Website](${org.website})` : ''}

${org.descriptionCleaned || ''}

## Job Details

- **Location:** ${job.location || 'Not specified'}
- **Job Type:** ${job.type ? formatJobType(job.type) : 'Not specified'}
- **Work Mode:** ${job.workMode ? formatWorkMode(job.workMode) : 'Not specified'}
- **Experience:** ${formatExperience(job.minExperience, job.maxExperience)}
- **Salary:** ${formatSalary(job.minSalary, job.maxSalary, job.currency, job.isSalaryNegotiable)}
- **Vacancies:** ${job.vacancies ?? 'Not specified'}
- **Posted on:** ${dateFormat.format(new Date(job.createdAt))}

## Skills Required

${job.skills.length > 0 ? job.skills.map(skill => `- ${skill}`).join('\n') : 'Not specified'}

## About the Job
---
${job.descriptionCleaned}
---
`;

	return new Response(markdown, {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
	});
}
