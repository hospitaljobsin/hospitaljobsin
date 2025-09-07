import type { pageSearchLocationMetadataFragment$key } from "@/__generated__/pageSearchLocationMetadataFragment.graphql";
import type SearchMetadataQueryNode from "@/__generated__/pageSearchLocationMetadataQuery.graphql";
import type { pageSearchLocationMetadataQuery } from "@/__generated__/pageSearchLocationMetadataQuery.graphql";
import type SearchViewLocationQueryNode from "@/__generated__/pageSearchLocationViewQuery.graphql";
import type { pageSearchLocationViewQuery } from "@/__generated__/pageSearchLocationViewQuery.graphql";
import { REASONABLE_JOB_COUNT } from "@/lib/constants";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { parseSearchParams } from "@/lib/searchParams";
import type { Metadata } from "next";
import { graphql, readInlineData } from "relay-runtime";
import SearchViewLocationClientComponent from ".//SearchViewLocationClientComponent";

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
	params,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
	params: Promise<{ location: string | string[] }>;
}): Promise<Metadata> {
	const filterParams = await searchParams;
	const locationParam = (await params).location;
	const location = Array.isArray(locationParam)
		? locationParam
				.map((segment) => decodeURIComponent(segment))
				.join("-")
				.replace(/-/g, " ")
		: decodeURIComponent(locationParam).replace(/-/g, " ");
	const variables = parseSearchParams(filterParams);

	console.log("generating metadata for search", variables);

	try {
		const preloadedQuery = await loadSerializableQuery<
			typeof SearchMetadataQueryNode,
			pageSearchLocationMetadataQuery
		>(PageSearchMetadataQuery, { ...variables, location });

		const data = readInlineData<pageSearchLocationMetadataFragment$key>(
			PageSearchMetadataFragment,
			preloadedQuery.data,
		);

		const jobCount = data.jobs.totalCount;
		const hasReasonableCount = jobCount && jobCount >= REASONABLE_JOB_COUNT;

		let title = hasReasonableCount
			? `${jobCount} Medical Jobs & Healthcare Careers`
			: "Medical Jobs & Healthcare Careers";
		let description = hasReasonableCount
			? `Discover ${jobCount} verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.`
			: "Discover verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.";

		if (location) {
			title += ` in ${location}`;
			description += ` Explore medical career opportunities in ${location}'s premier hospitals, specialty clinics & healthcare centers.`;
		} else {
			title += " | India's Medical Job Portal";
			description +=
				" Browse nationwide medical career opportunities across India's leading healthcare networks.";
		}

		return {
			title,
			description,
		};
	} catch (error) {
		console.error("Error generating search metadata:", error);

		// Fallback metadata
		const title =
			"Medical Jobs & Healthcare Careers in India | Leading Medical Job Portal";
		const description =
			"Discover verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities across India.";

		return {
			title,
			description,
		};
	}
}

export default async function SearchPage({
	searchParams,
	params,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
	params: Promise<{ location: string | string[] }>;
}) {
	const filterParams = await searchParams;
	const variables = parseSearchParams(filterParams);
	const locationParam = (await params).location;
	const location = Array.isArray(locationParam)
		? locationParam
				.map((segment) => decodeURIComponent(segment))
				.join("-")
				.replace(/-/g, " ")
		: decodeURIComponent(locationParam).replace(/-/g, " ");

	console.log("location", location);

	const preloadedQuery = await loadSerializableQuery<
		typeof SearchViewLocationQueryNode,
		pageSearchLocationViewQuery
	>(PageSearchLocationViewQuery, { ...variables, location });

	return (
		<SearchViewLocationClientComponent
			preloadedQuery={preloadedQuery}
			location={location}
		/>
	);
}
