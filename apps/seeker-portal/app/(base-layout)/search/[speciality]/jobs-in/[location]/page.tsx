import type { Metadata } from 'next';
import { graphql, readInlineData } from 'relay-runtime';
import type { pageSearchLocationSpecialityMetadataFragment$key } from '@/__generated__/pageSearchLocationSpecialityMetadataFragment.graphql';
import type SearchMetadataQueryNode from '@/__generated__/pageSearchLocationSpecialityMetadataQuery.graphql';
import type { pageSearchLocationSpecialityMetadataQuery } from '@/__generated__/pageSearchLocationSpecialityMetadataQuery.graphql';
import type SearchViewLocationQueryNode from '@/__generated__/pageSearchLocationSpecialityViewQuery.graphql';
import type { pageSearchLocationSpecialityViewQuery } from '@/__generated__/pageSearchLocationSpecialityViewQuery.graphql';
import { REASONABLE_JOB_COUNT } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';
import { parseSearchParams } from '@/lib/searchParams';
import SearchViewLocationSpecialityClientComponent from './SearchViewLocationSpecialityClientComponent';

export const PageSearchLocationSpecialityViewQuery = graphql`
  query pageSearchLocationSpecialityViewQuery(
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
    ...SearchViewLocationSpecialityClientComponentFragment @arguments(
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
  query pageSearchLocationSpecialityMetadataQuery(
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
	...pageSearchLocationSpecialityMetadataFragment @arguments(
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
 fragment pageSearchLocationSpecialityMetadataFragment on Query @inline @argumentDefinitions(
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
	params: Promise<{
		location: string | string[];
		speciality: string | string[];
	}>;
}): Promise<Metadata> {
	const filterParams = await searchParams;
	const locationParam = (await params).location;
	const specialityParam = (await params).speciality;
	const speciality = Array.isArray(specialityParam)
		? specialityParam
				.map(segment => decodeURIComponent(segment))
				.join('-')
				.replace(/-/g, ' ')
		: decodeURIComponent(specialityParam).replace(/-/g, ' ');
	const location = Array.isArray(locationParam)
		? locationParam
				.map(segment => decodeURIComponent(segment))
				.join('-')
				.replace(/-/g, ' ')
		: decodeURIComponent(locationParam).replace(/-/g, ' ');
	const variables = parseSearchParams(filterParams);

	const preloadedQuery = await loadSerializableQuery<typeof SearchMetadataQueryNode, pageSearchLocationSpecialityMetadataQuery>(
		PageSearchMetadataQuery,
		{
			...variables,
			location,
			searchTerm: speciality
		}
	);

	const data = readInlineData<pageSearchLocationSpecialityMetadataFragment$key>(PageSearchMetadataFragment, preloadedQuery.data);

	const jobCount = data.jobs.totalCount;
	const hasReasonableCount = jobCount && jobCount >= REASONABLE_JOB_COUNT;

	let title = '';
	let description = hasReasonableCount
		? `Discover ${jobCount} verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.`
		: 'Discover verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.';

	if (speciality) {
		// Enhance search term titles with medical context
		if (hasReasonableCount) {
			title = `${jobCount} ${speciality} Jobs`;
			description = `Find ${jobCount} ${speciality} positions at leading healthcare institutions. Join top medical facilities as a ${speciality.toLowerCase()} with competitive salaries & benefits.`;
		} else {
			title = `${speciality} Jobs`;
			description = `Find ${speciality} positions at leading healthcare institutions. Join top medical facilities as a ${speciality.toLowerCase()} with competitive salaries & benefits.`;
		}
	}

	if (location) {
		title += ` in ${location}`;
		description += ` Explore medical career opportunities in ${location}'s premier hospitals, specialty clinics & healthcare centers.`;
	} else {
		description += " Browse nationwide medical career opportunities across India's leading healthcare networks.";
	}

	return {
		title,
		description,
		robots: {
			index: true,
			follow: true
		},
		alternates: {
			canonical: `${env.NEXT_PUBLIC_URL}${links.search(location, speciality)}`
		}
	};
}

export default async function SearchPage({
	searchParams,
	params
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
	params: Promise<{
		location: string | string[];
		speciality: string | string[];
	}>;
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
	const specialityParam = (await params).speciality;
	const speciality = Array.isArray(specialityParam)
		? specialityParam
				.map(segment => decodeURIComponent(segment))
				.join('-')
				.replace(/-/g, ' ')
		: decodeURIComponent(specialityParam).replace(/-/g, ' ');

	const preloadedQuery = await loadSerializableQuery<typeof SearchViewLocationQueryNode, pageSearchLocationSpecialityViewQuery>(
		PageSearchLocationSpecialityViewQuery,
		{
			...variables,
			searchTerm: speciality,
			location
		},
		{
			metadata: {
				includeAuth: true
			}
		}
	);

	return <SearchViewLocationSpecialityClientComponent preloadedQuery={preloadedQuery} speciality={speciality} location={location} />;
}
