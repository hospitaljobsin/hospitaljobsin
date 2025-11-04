import type { Metadata } from 'next';
import { graphql, readInlineData } from 'relay-runtime';
import 'leaflet/dist/leaflet.css';
import type { pageSearchMapLocationMetadataFragment$key } from '@/__generated__/pageSearchMapLocationMetadataFragment.graphql';
import type SearchMetadataQueryNode from '@/__generated__/pageSearchMapLocationMetadataQuery.graphql';
import type { pageSearchMapLocationMetadataQuery } from '@/__generated__/pageSearchMapLocationMetadataQuery.graphql';
import type SearchMapViewQueryNode from '@/__generated__/pageSearchMapLocationViewQuery.graphql';
import type { pageSearchMapLocationViewQuery } from '@/__generated__/pageSearchMapLocationViewQuery.graphql';
import { REASONABLE_JOB_COUNT } from '@/lib/constants';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';
import { parseSearchParams } from '@/lib/searchParams';
import MapViewClientComponent from '../../MapViewClientComponent';

export const PageSearchMapLocationViewQuery = graphql`
  query pageSearchMapLocationViewQuery(
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
  query pageSearchMapLocationMetadataQuery(
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
	...pageSearchMapLocationMetadataFragment @arguments(
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
 fragment pageSearchMapLocationMetadataFragment on Query @inline @argumentDefinitions(
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

	const preloadedQuery = await loadSerializableQuery<typeof SearchMetadataQueryNode, pageSearchMapLocationMetadataQuery>(
		PageSearchMetadataQuery,
		{ ...variables, location, searchTerm: null }
	);

	const data = readInlineData<pageSearchMapLocationMetadataFragment$key>(PageSearchMetadataFragment, preloadedQuery.data);

	const jobCount = data.jobs.totalCount;
	const hasReasonableCount = jobCount && jobCount >= REASONABLE_JOB_COUNT;

	let title = hasReasonableCount ? `Search ${jobCount} Healthcare Jobs` : 'Search Healthcare Jobs';
	let description = '';

	title += ` in ${location} - Map View`;
	description += ` Explore hospital jobs across ${location} using our interactive job map. View real-time openings near you and apply directly to nearby hospitals.`;

	return {
		title,
		description,
		robots: {
			index: true,
			follow: true
		},
		alternates: {
			canonical: `${env.NEXT_PUBLIC_URL}${links.searchMap(location)}`
		}
	};
}

export default async function MapPage({
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

	const preloadedQuery = await loadSerializableQuery<typeof SearchMapViewQueryNode, pageSearchMapLocationViewQuery>(
		PageSearchMapLocationViewQuery,
		{
			...variables,
			location,
			searchTerm: null,
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

	return <MapViewClientComponent preloadedQuery={preloadedQuery} location={location} />;
}
