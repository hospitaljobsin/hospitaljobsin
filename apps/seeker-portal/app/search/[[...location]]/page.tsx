import type { JobWorkModeFilter } from "@/__generated__/SearchJobsListRefetchQuery.graphql";
import type { pageSearchMetadataFragment$key } from "@/__generated__/pageSearchMetadataFragment.graphql";
import type SearchMetadataQueryNode from "@/__generated__/pageSearchMetadataQuery.graphql";
import type {
	JobTypeFilter,
	pageSearchMetadataQuery,
} from "@/__generated__/pageSearchMetadataQuery.graphql";
import type SearchViewQueryNode from "@/__generated__/pageSearchViewQuery.graphql";
import type { pageSearchViewQuery } from "@/__generated__/pageSearchViewQuery.graphql";
import { FILTER_DEFAULTS } from "@/lib/constants";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import type { Metadata } from "next";
import { graphql, readInlineData } from "relay-runtime";
import SearchViewClientComponent from "./SearchViewClientComponent";

export const PageSearchViewQuery = graphql`
  query pageSearchViewQuery(
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
    ...SearchViewClientComponentFragment @arguments(
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
  query pageSearchMetadataQuery(
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
	...pageSearchMetadataFragment @arguments(
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
 fragment pageSearchMetadataFragment on Query @inline @argumentDefinitions(
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

// Helper function to parse search params with default values
function parseSearchParams(
	searchParams: Record<string, string | string[] | undefined>,
) {
	const VALID_WORK_MODES = ["HYBRID", "OFFICE", "REMOTE"] as const;
	const VALID_JOB_TYPES = [
		"CONTRACT",
		"FULL_TIME",
		"INTERNSHIP",
		"LOCUM",
		"PART_TIME",
	] as const;

	const parseStringParam = (
		param: string | string[] | undefined,
		defaultValue: string,
	): string => {
		if (typeof param === "string") return param;
		if (Array.isArray(param) && param.length > 0) return param[0];
		return defaultValue;
	};

	const parseIntParam = (
		param: string | string[] | undefined,
	): number | null => {
		const value = parseStringParam(param, "");
		const parsed = Number.parseInt(value, 10);
		return Number.isNaN(parsed) ? null : parsed;
	};

	const parseFloatParam = (
		param: string | string[] | undefined,
	): number | null => {
		const value = parseStringParam(param, "");
		const parsed = Number.parseFloat(value);
		return Number.isNaN(parsed) ? null : parsed;
	};

	const parseArrayParam = (param: string | string[] | undefined): string[] => {
		if (Array.isArray(param)) return param;
		if (typeof param === "string" && param) {
			// Handle comma-separated values
			return param
				.split(",")
				.map((item) => item.trim())
				.filter((item) => item);
		}
		return [];
	};

	const validateEnumArray = <T extends string>(
		values: string[],
		validValues: readonly T[],
	): T[] => {
		return values.filter((value) => validValues.includes(value as T)) as T[];
	};

	const workModeValues = validateEnumArray(
		parseArrayParam(searchParams.workMode),
		VALID_WORK_MODES,
	);
	const jobTypeValues = validateEnumArray(
		parseArrayParam(searchParams.jobType),
		VALID_JOB_TYPES,
	);

	return {
		searchTerm:
			parseStringParam(searchParams.q, FILTER_DEFAULTS.q || "") || null,
		minExperience: parseIntParam(searchParams.minExperience),
		minSalary: parseIntParam(searchParams.minSalary),
		maxSalary: parseIntParam(searchParams.maxSalary),
		proximityKm:
			parseFloatParam(searchParams.proximityKm) ?? FILTER_DEFAULTS.proximityKm,
		workMode: workModeValues as readonly JobWorkModeFilter[],
		jobType: jobTypeValues as readonly JobTypeFilter[],
		sortBy: parseStringParam(searchParams.sortBy, FILTER_DEFAULTS.sortBy) as
			| "RELEVANCE"
			| "UPDATED_AT",
	};
}

export async function generateMetadata({
	searchParams,
	params,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
	params: Promise<{ location: string | string[] | undefined }>;
}): Promise<Metadata> {
	const filterParams = await searchParams;
	const locationParam = (await params).location;
	const location = Array.isArray(locationParam)
		? locationParam.map((segment) => decodeURIComponent(segment)).join("-")
		: locationParam
			? decodeURIComponent(locationParam)
			: locationParam;
	const variables = parseSearchParams(filterParams);

	console.log("generating metadata for search", variables);

	try {
		const preloadedQuery = await loadSerializableQuery<
			typeof SearchMetadataQueryNode,
			pageSearchMetadataQuery
		>(PageSearchMetadataQuery, { ...variables, location });

		const data = readInlineData<pageSearchMetadataFragment$key>(
			PageSearchMetadataFragment,
			preloadedQuery.data,
		);

		const jobCount = data.jobs.totalCount;
		const searchTerm = variables.searchTerm;

		let title = `${jobCount}+ Medical Jobs & Healthcare Careers`;
		let description = `Discover ${jobCount}+ verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.`;

		if (searchTerm) {
			// Enhance search term titles with medical context
			const medicalTitle =
				searchTerm.toLowerCase().includes("doctor") ||
				searchTerm.toLowerCase().includes("physician")
					? `${jobCount}+ ${searchTerm} Positions & Medical Careers`
					: searchTerm.toLowerCase().includes("nurse") ||
							searchTerm.toLowerCase().includes("nursing")
						? `${jobCount}+ ${searchTerm} Jobs & Healthcare Opportunities`
						: `${jobCount}+ ${searchTerm} Medical Jobs & Healthcare Careers`;

			title = medicalTitle;
			description = `Find ${jobCount}+ ${searchTerm} positions at leading healthcare institutions. Join top medical facilities as a ${searchTerm.toLowerCase()} with competitive salaries & benefits.`;
		}

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
		let title =
			"Medical Jobs & Healthcare Careers in India | Leading Medical Job Portal";
		let description =
			"Discover verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities across India.";

		if (variables.searchTerm) {
			title = `${variables.searchTerm} Medical Jobs & Healthcare Careers in India`;
			description = `Find ${variables.searchTerm} positions at leading healthcare institutions across India. Join premier medical facilities with competitive salaries & comprehensive benefits.`;
		}

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
	params: Promise<{ location: string | string[] | undefined }>;
}) {
	const filterParams = await searchParams;
	const variables = parseSearchParams(filterParams);
	const locationParam = (await params).location;
	const location = Array.isArray(locationParam)
		? locationParam.map((segment) => decodeURIComponent(segment)).join("-")
		: locationParam
			? decodeURIComponent(locationParam)
			: locationParam;

	console.log("location", location);

	const preloadedQuery = await loadSerializableQuery<
		typeof SearchViewQueryNode,
		pageSearchViewQuery
	>(PageSearchViewQuery, { ...variables, location });

	return (
		<SearchViewClientComponent
			preloadedQuery={preloadedQuery}
			location={location}
		/>
	);
}
