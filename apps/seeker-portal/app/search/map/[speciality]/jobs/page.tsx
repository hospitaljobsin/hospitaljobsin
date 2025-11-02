import type { Metadata } from 'next';
import { graphql, readInlineData } from 'relay-runtime';
import 'leaflet/dist/leaflet.css';
import type { pageSearchMapSpecialityMetadataFragment$key } from '@/__generated__/pageSearchMapSpecialityMetadataFragment.graphql';
import type SearchMetadataQueryNode from '@/__generated__/pageSearchMapSpecialityMetadataQuery.graphql';
import type { pageSearchMapSpecialityMetadataQuery } from '@/__generated__/pageSearchMapSpecialityMetadataQuery.graphql';
import type SearchMapViewQueryNode from '@/__generated__/pageSearchMapSpecialityViewQuery.graphql';
import type { pageSearchMapSpecialityViewQuery } from '@/__generated__/pageSearchMapSpecialityViewQuery.graphql';
import { REASONABLE_JOB_COUNT } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';
import { parseSearchParams } from '@/lib/searchParams';
import MapViewClientComponent from '../../MapViewClientComponent';

export const PageSearchMapSpecialityViewQuery = graphql`
  query pageSearchMapSpecialityViewQuery(
		$searchTerm: String
		$minExperience: Int
		$minSalary: Int
		$maxSalary: Int
		$proximityKm: Float
		$location: String
		$bounds: BoundingBoxInput!
		$workMode: [JobWorkModeFilter!]!
		$jobType: [JobTypeFilter!]!
		$zoomLevel: Int!
		$sortBy: JobSearchSortBy!
	) {
    ...MapViewClientComponentFragment  @arguments(
		inputSearchTerm: $searchTerm,
		inputMinExperience: $minExperience,
		inputMinSalary: $minSalary,
		inputMaxSalary: $maxSalary,
		inputProximityKm: $proximityKm,
		inputLocation: $location,
		inputWorkMode: $workMode,
		inputJobType: $jobType,
		inputZoomLevel: $zoomLevel,
		inputSortBy: $sortBy,
	)
  }
`;

const PageSearchMetadataQuery = graphql`
  query pageSearchMapSpecialityMetadataQuery(
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
	...pageSearchMapSpecialityMetadataFragment @arguments(
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
 fragment pageSearchMapSpecialityMetadataFragment on Query @inline @argumentDefinitions(
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
	params: Promise<{ speciality: string | string[] }>;
}): Promise<Metadata> {
	const filterParams = await searchParams;
	const specialityParam = (await params).speciality;
	const speciality = Array.isArray(specialityParam)
		? specialityParam
				.map(segment => decodeURIComponent(segment))
				.join('-')
				.replace(/-/g, ' ')
		: decodeURIComponent(specialityParam).replace(/-/g, ' ');
	const variables = parseSearchParams(filterParams);

	const preloadedQuery = await loadSerializableQuery<typeof SearchMetadataQueryNode, pageSearchMapSpecialityMetadataQuery>(
		PageSearchMetadataQuery,
		{ ...variables, searchTerm: speciality, location: null }
	);

	const data = readInlineData<pageSearchMapSpecialityMetadataFragment$key>(PageSearchMetadataFragment, preloadedQuery.data);

	const jobCount = data.jobs.totalCount;
	const hasReasonableCount = jobCount && jobCount >= REASONABLE_JOB_COUNT;

	let title = '';
	let description = hasReasonableCount
		? `Discover ${jobCount} verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.`
		: 'Discover verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.';

	if (speciality) {
		// Enhance search term titles with medical context
		if (hasReasonableCount) {
			title = `${jobCount} ${speciality} Jobs - Map View`;
			description = `Explore ${jobCount} ${speciality} positions on an interactive map. Find opportunities at leading healthcare institutions as a ${speciality.toLowerCase()} with competitive salaries & benefits.`;
		} else {
			title = `${speciality} Jobs - Map View`;
			description = `Explore ${speciality} positions on an interactive map. Find opportunities at leading healthcare institutions as a ${speciality.toLowerCase()} with competitive salaries & benefits.`;
		}
	}

	description += " Browse nationwide medical career opportunities across India's leading healthcare networks.";

	return {
		title,
		description,
		robots: {
			index: true,
			follow: true
		},
		alternates: {
			canonical: `${env.NEXT_PUBLIC_URL}${links.searchMap(undefined, speciality)}`
		}
	};
}

export default async function MapPage({
	searchParams,
	params
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
	params: Promise<{ speciality: string | string[] }>;
}) {
	const filterParams = await searchParams;
	const variables = parseSearchParams(filterParams);
	const specialityParam = (await params).speciality;
	const speciality = Array.isArray(specialityParam)
		? specialityParam
				.map(segment => decodeURIComponent(segment))
				.join('-')
				.replace(/-/g, ' ')
		: decodeURIComponent(specialityParam).replace(/-/g, ' ');

	const preloadedQuery = await loadSerializableQuery<typeof SearchMapViewQueryNode, pageSearchMapSpecialityViewQuery>(
		PageSearchMapSpecialityViewQuery,
		{
			...variables,
			searchTerm: speciality,
			location: null,
			bounds: {
				swLat: 8.0883,
				swLng: 68.1766,
				neLat: 37.6173,
				neLng: 97.3951
			}, // Default bounds for India
			zoomLevel: 5, // Default zoom level
			first: 100 // Load more jobs for map view
		},
		{
			metadata: {
				includeAuth: true
			}
		}
	);

	return <MapViewClientComponent preloadedQuery={preloadedQuery} searchTerm={speciality} />;
}
