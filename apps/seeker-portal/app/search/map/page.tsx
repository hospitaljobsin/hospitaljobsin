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
		$bounds: BoundingBoxInput!
		$workMode: [JobWorkModeFilter!]!
		$jobType: [JobTypeFilter!]!
		$zoomLevel: Int!
		$sortBy: JobSearchSortBy!
		$first: Int!
	) {
    ...MapViewClientComponentFragment
  }
`;

export const metadata: Metadata = {
	title: 'Healthcare Jobs - Map View',
	description:
		"Explore verified healthcare jobs for doctors, nurses, pharmacists, technicians & healthcare professionals on an interactive map. Apply directly to top hospitals, clinics & medical facilities across India's leading healthcare networks.",
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

	return <MapViewClientComponent preloadedQuery={preloadedQuery} />;
}
