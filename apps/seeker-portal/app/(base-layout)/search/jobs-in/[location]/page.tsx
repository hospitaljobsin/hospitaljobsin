import type { Metadata } from 'next';
import { graphql, readInlineData } from 'relay-runtime';
import type { pageSearchLocationMetadataFragment$key } from '@/__generated__/pageSearchLocationMetadataFragment.graphql';
import type SearchMetadataQueryNode from '@/__generated__/pageSearchLocationMetadataQuery.graphql';
import type { pageSearchLocationMetadataQuery } from '@/__generated__/pageSearchLocationMetadataQuery.graphql';
import type SearchViewLocationQueryNode from '@/__generated__/pageSearchLocationViewQuery.graphql';
import type { pageSearchLocationViewQuery } from '@/__generated__/pageSearchLocationViewQuery.graphql';
import { REASONABLE_JOB_COUNT } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';
import { parseSearchParams } from '@/lib/searchParams';
import SearchViewLocationClientComponent from './/SearchViewLocationClientComponent';

export const PageSearchLocationViewQuery = graphql`
  query pageSearchLocationViewQuery(
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
    ...SearchViewLocationClientComponentFragment @arguments(
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

const PageSearchMetadataQuery = graphql`
  query pageSearchLocationMetadataQuery(
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
	...pageSearchLocationMetadataFragment @arguments(
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

const PageSearchMetadataFragment = graphql`
 fragment pageSearchLocationMetadataFragment on Query @inline @argumentDefinitions(
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
		jobs(after: null, first: 25, searchTerm: $searchTerm, proximityKm: $proximityKm, minExperience: $minExperience, minSalary: $minSalary, maxSalary: $maxSalary, workMode: $workMode, jobType: $jobType, sortBy: $sortBy, location: $location) {
			totalCount
		}
	}
`;

export async function generateMetadata({
	searchParams,
	params
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
	params: Promise<{ location: string | string[] }>;
}): Promise<Metadata> {
	const filterParams = await searchParams;
	const locationParam = (await params).location;
	const location = Array.isArray(locationParam)
		? locationParam
				.map(segment => decodeURIComponent(segment))
				.join('-')
				.replace(/-/g, ' ')
		: decodeURIComponent(locationParam).replace(/-/g, ' ');
	const variables = parseSearchParams(filterParams);

	const preloadedQuery = await loadSerializableQuery<typeof SearchMetadataQueryNode, pageSearchLocationMetadataQuery>(
		PageSearchMetadataQuery,
		{ ...variables, location, searchTerm: null }
	);

	const data = readInlineData<pageSearchLocationMetadataFragment$key>(PageSearchMetadataFragment, preloadedQuery.data);

	const jobCount = data.jobs.totalCount;
	const hasReasonableCount = jobCount && jobCount >= REASONABLE_JOB_COUNT;

	let title = hasReasonableCount ? `${jobCount} Healthcare Jobs` : 'Healthcare Jobs';
	let description = hasReasonableCount
		? `Discover ${jobCount} verified healthcare jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.`
		: 'Discover verified healthcare jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.';

	if (location) {
		title += ` in ${location}`;
		description += ` Explore healthcare career opportunities in ${location}'s premier hospitals, specialty clinics & healthcare centers.`;
	} else {
		description += " Browse nationwide healthcare career opportunities across India's leading healthcare networks.";
	}

	return {
		title,
		description,
		robots: {
			index: true,
			follow: true
		},
		alternates: {
			canonical: `${env.NEXT_PUBLIC_URL}${links.search(location)}`
		}
	};
}

export default async function SearchPage({
	searchParams,
	params
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
	params: Promise<{ location: string | string[] }>;
}) {
	const filterParams = await searchParams;
	const variables = parseSearchParams(filterParams);
	const locationParam = (await params).location;
	const location = Array.isArray(locationParam)
		? locationParam
				.map(segment => decodeURIComponent(segment))
				.join('-')
				.replace(/-/g, ' ')
		: decodeURIComponent(locationParam).replace(/-/g, ' ');

	console.log('location', location);

	const preloadedQuery = await loadSerializableQuery<typeof SearchViewLocationQueryNode, pageSearchLocationViewQuery>(
		PageSearchLocationViewQuery,
		{ ...variables, location, searchTerm: null },
		{
			metadata: {
				includeAuth: true
			}
		}
	);

	return <SearchViewLocationClientComponent preloadedQuery={preloadedQuery} location={location} />;
}
