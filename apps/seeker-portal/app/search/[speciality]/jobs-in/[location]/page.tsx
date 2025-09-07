import type { JobWorkModeFilter } from "@/__generated__/SearchJobsListRefetchQuery.graphql";
import type { pageSearchLocationSpecialityMetadataFragment$key } from "@/__generated__/pageSearchLocationSpecialityMetadataFragment.graphql";
import type SearchMetadataQueryNode from "@/__generated__/pageSearchLocationSpecialityMetadataQuery.graphql";
import type {
	JobTypeFilter,
	pageSearchLocationSpecialityMetadataQuery,
} from "@/__generated__/pageSearchLocationSpecialityMetadataQuery.graphql";
import type SearchViewLocationQueryNode from "@/__generated__/pageSearchLocationSpecialityViewQuery.graphql";
import type { pageSearchLocationSpecialityViewQuery } from "@/__generated__/pageSearchLocationSpecialityViewQuery.graphql";
import { FILTER_DEFAULTS } from "@/lib/constants";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import type { Metadata } from "next";
import { graphql, readInlineData } from "relay-runtime";
import SearchViewLocationSpecialityClientComponent from "./SearchViewLocationSpecialityClientComponent";

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
		searchTerm: null, // searchTerm will be set from path parameter, not query param
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
	params: Promise<{
		location: string | string[];
		speciality: string | string[];
	}>;
}): Promise<Metadata> {
	const filterParams = await searchParams;
	const locationParam = (await params).location;
	const specialityParam = (await params).speciality;
	const speciality = Array.isArray(specialityParam)
		? specialityParam.map((segment) => decodeURIComponent(segment)).join("-")
		: decodeURIComponent(specialityParam);
	const location = Array.isArray(locationParam)
		? locationParam.map((segment) => decodeURIComponent(segment)).join("-")
		: decodeURIComponent(locationParam);
	const variables = parseSearchParams(filterParams);

	console.log("generating metadata for search", variables);

	try {
		const preloadedQuery = await loadSerializableQuery<
			typeof SearchMetadataQueryNode,
			pageSearchLocationSpecialityMetadataQuery
		>(PageSearchMetadataQuery, { ...variables, location });

		const data =
			readInlineData<pageSearchLocationSpecialityMetadataFragment$key>(
				PageSearchMetadataFragment,
				preloadedQuery.data,
			);

		const jobCount = data.jobs.totalCount;

		let title = `${jobCount}+ Medical Jobs & Healthcare Careers`;
		let description = `Discover ${jobCount}+ verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.`;

		if (speciality) {
			// Enhance search term titles with medical context
			const medicalTitle =
				speciality.toLowerCase().includes("doctor") ||
				speciality.toLowerCase().includes("physician")
					? `${jobCount}+ ${speciality} Positions & Medical Careers`
					: speciality.toLowerCase().includes("nurse") ||
							speciality.toLowerCase().includes("nursing")
						? `${jobCount}+ ${speciality} Jobs & Healthcare Opportunities`
						: `${jobCount}+ ${speciality} Medical Jobs & Healthcare Careers`;

			title = medicalTitle;
			description = `Find ${jobCount}+ ${speciality} positions at leading healthcare institutions. Join top medical facilities as a ${speciality.toLowerCase()} with competitive salaries & benefits.`;
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

		if (speciality) {
			title = `${speciality} Medical Jobs & Healthcare Careers in India`;
			description = `Find ${speciality} positions at leading healthcare institutions across India. Join premier medical facilities with competitive salaries & comprehensive benefits.`;
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
	params: Promise<{
		location: string | string[];
		speciality: string | string[];
	}>;
}) {
	const filterParams = await searchParams;
	const variables = parseSearchParams(filterParams);
	const locationParam = (await params).location;
	const location = Array.isArray(locationParam)
		? locationParam.map((segment) => decodeURIComponent(segment)).join("-")
		: decodeURIComponent(locationParam);
	const specialityParam = (await params).speciality;
	const speciality = Array.isArray(specialityParam)
		? specialityParam.map((segment) => decodeURIComponent(segment)).join("-")
		: decodeURIComponent(specialityParam);

	console.log("speciality", speciality);

	const preloadedQuery = await loadSerializableQuery<
		typeof SearchViewLocationQueryNode,
		pageSearchLocationSpecialityViewQuery
	>(PageSearchLocationSpecialityViewQuery, {
		...variables,
		searchTerm: speciality,
		location,
	});

	return (
		<SearchViewLocationSpecialityClientComponent
			preloadedQuery={preloadedQuery}
			speciality={speciality}
			location={location}
		/>
	);
}
