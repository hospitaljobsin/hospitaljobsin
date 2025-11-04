import type { Metadata } from 'next';
import { graphql, readInlineData } from 'relay-runtime';
import 'leaflet/dist/leaflet.css';
import type { pageSearchMapLocationSpecialityMetadataFragment$key } from '@/__generated__/pageSearchMapLocationSpecialityMetadataFragment.graphql';
import type SearchMetadataQueryNode from '@/__generated__/pageSearchMapLocationSpecialityMetadataQuery.graphql';
import type { pageSearchMapLocationSpecialityMetadataQuery } from '@/__generated__/pageSearchMapLocationSpecialityMetadataQuery.graphql';
import type SearchMapViewQueryNode from '@/__generated__/pageSearchMapLocationSpecialityViewQuery.graphql';
import type { pageSearchMapLocationSpecialityViewQuery } from '@/__generated__/pageSearchMapLocationSpecialityViewQuery.graphql';
import { REASONABLE_JOB_COUNT } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';
import { parseSearchParams } from '@/lib/searchParams';
import MapViewClientComponent from '../../../MapViewClientComponent';

export const PageSearchMapLocationSpecialityViewQuery = graphql`
  query pageSearchMapLocationSpecialityViewQuery(
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
    ...MapViewClientComponentFragment @arguments(
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
  query pageSearchMapLocationSpecialityMetadataQuery(
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
	...pageSearchMapLocationSpecialityMetadataFragment @arguments(
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
 fragment pageSearchMapLocationSpecialityMetadataFragment on Query @inline @argumentDefinitions(
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

	const preloadedQuery = await loadSerializableQuery<typeof SearchMetadataQueryNode, pageSearchMapLocationSpecialityMetadataQuery>(
		PageSearchMetadataQuery,
		{
			...variables,
			location,
			searchTerm: speciality
		}
	);

	const data = readInlineData<pageSearchMapLocationSpecialityMetadataFragment$key>(PageSearchMetadataFragment, preloadedQuery.data);

	const jobCount = data.jobs.totalCount;
	const hasReasonableCount = jobCount && jobCount >= REASONABLE_JOB_COUNT;

	let title = '';
	let description = '';

	if (speciality) {
		// Enhance search term titles with medical context
		if (hasReasonableCount) {
			title = `Search ${jobCount} ${speciality} Jobs`;
			description = `Discover ${jobCount} ${speciality} jobs in ${location} through our map-based search. See live openings near you and apply directly to top hospitals.`;
		} else {
			title = `Search ${speciality} Jobs`;
			description = `Discover ${speciality} jobs in ${location} through our map-based search. See live openings near you and apply directly to top hospitals.`;
		}
	}

	if (location) {
		title += ` in ${location} - Map View`;
	} else {
		title += ' - Map View';
	}

	return {
		title,
		description,
		robots: {
			index: true,
			follow: true
		},
		alternates: {
			canonical: `${env.NEXT_PUBLIC_URL}${links.searchMap(location, speciality)}`
		}
	};
}

export default async function MapPage({
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

	const preloadedQuery = await loadSerializableQuery<typeof SearchMapViewQueryNode, pageSearchMapLocationSpecialityViewQuery>(
		PageSearchMapLocationSpecialityViewQuery,
		{
			...variables,
			searchTerm: speciality,
			location,
			bounds: {
				swLat: 8.0883,
				swLng: 68.1766,
				neLat: 37.6173,
				neLng: 97.3951
			}, // Default bounds for India
			zoomLevel: 5 // Default zoom level
		},
		{
			metadata: {
				includeAuth: true
			}
		}
	);

	return <MapViewClientComponent preloadedQuery={preloadedQuery} location={location} searchTerm={speciality} />;
}
