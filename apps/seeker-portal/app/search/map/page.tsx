import type { Metadata } from 'next';
import { graphql } from 'relay-runtime';
import 'leaflet/dist/leaflet.css';
import type SearchMapViewQueryNode from '@/__generated__/pageSearchMapViewQuery.graphql';
import type { pageSearchMapViewQuery } from '@/__generated__/pageSearchMapViewQuery.graphql';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';
import { parseSearchParams } from '@/lib/searchParams';
import MapViewClientComponent from './MapViewClientComponent';

const PageSearchMapViewQuery = graphql`
  query pageSearchMapViewQuery(
		$searchTerm: String
		$minExperience: Int
		$minSalary: Int
		$maxSalary: Int
		$proximityKm: Float
		$location: String
		$bounds: BoundingBoxInput
		$workMode: [JobWorkModeFilter!]!
		$jobType: [JobTypeFilter!]!
		$sortBy: JobSearchSortBy!
		$first: Int!
	) {
    ...MapViewClientComponentFragment @arguments(
		searchTerm: $searchTerm
		minExperience: $minExperience
		minSalary: $minSalary
		maxSalary: $maxSalary
		proximityKm: $proximityKm
		location: $location
		bounds: $bounds
		workMode: $workMode
		jobType: $jobType
		sortBy: $sortBy
		first: $first
	)
  }
`;

export const metadata: Metadata = {
	title: 'Hospital Jobs Map - Find Healthcare Jobs Near You',
	description:
		'Explore hospital and healthcare job opportunities on an interactive map. Find jobs for doctors, nurses, pharmacists, and healthcare professionals across India.',
	robots: {
		index: true,
		follow: true
	},
	alternates: {
		canonical: `${env.NEXT_PUBLIC_URL}${links.searchMap()}`
	}
};

export default async function MapPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
	const filterParams = await searchParams;
	const variables = parseSearchParams(filterParams);

	const preloadedQuery = await loadSerializableQuery<typeof SearchMapViewQueryNode, pageSearchMapViewQuery>(
		PageSearchMapViewQuery,
		{
			...variables,
			bounds: null, // Will be set by client on map interaction
			first: 100 // Load more jobs for map view
		},
		{
			metadata: {
				includeAuth: true
			}
		}
	);

	return <MapViewClientComponent preloadedQuery={preloadedQuery} />;
}
