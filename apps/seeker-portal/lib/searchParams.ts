import type {
	JobTypeFilter,
	JobWorkModeFilter,
} from "@/__generated__/SearchJobsListRefetchQuery.graphql";
import { FILTER_DEFAULTS } from "@/lib/constants";

export interface ParsedSearchParams {
	minExperience: number | null;
	minSalary: number | null;
	maxSalary: number | null;
	proximityKm: number;
	workMode: readonly JobWorkModeFilter[];
	jobType: readonly JobTypeFilter[];
	sortBy: "RELEVANCE" | "UPDATED_AT";
}

/**
 * Parses and validates search parameters from URL search params
 * @param searchParams - The search parameters object from Next.js
 * @returns Parsed and validated search parameters with defaults applied
 */
export function parseSearchParams(
	searchParams: Record<string, string | string[] | undefined>,
): ParsedSearchParams {
	const VALID_WORK_MODES = ["HYBRID", "OFFICE", "REMOTE"] as const;
	const VALID_JOB_TYPES = [
		"CONTRACT",
		"FULL_TIME",
		"INTERNSHIP",
		"LOCUM",
		"PART_TIME",
	] as const;
	const VALID_SORT_BY = ["RELEVANCE", "UPDATED_AT"] as const;

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

	const validateSortBy = (value: string): "RELEVANCE" | "UPDATED_AT" => {
		return VALID_SORT_BY.includes(value as (typeof VALID_SORT_BY)[number])
			? (value as "RELEVANCE" | "UPDATED_AT")
			: "RELEVANCE";
	};

	return {
		minExperience: parseIntParam(searchParams.minExperience),
		minSalary: parseIntParam(searchParams.minSalary),
		maxSalary: parseIntParam(searchParams.maxSalary),
		proximityKm:
			parseFloatParam(searchParams.proximityKm) ?? FILTER_DEFAULTS.proximityKm,
		workMode: workModeValues as readonly JobWorkModeFilter[],
		jobType: jobTypeValues as readonly JobTypeFilter[],
		sortBy: validateSortBy(parseStringParam(searchParams.sortBy, "RELEVANCE")),
	};
}
