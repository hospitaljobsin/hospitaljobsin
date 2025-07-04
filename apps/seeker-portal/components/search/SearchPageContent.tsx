import type { SearchPageContent_query$key } from "@/__generated__/SearchPageContent_query.graphql";
import pageSearchQuery, {
	type pageSearchQuery as pageSearchQueryType,
} from "@/__generated__/pageSearchQuery.graphql";
import type { Filters } from "@/app/search/page";
import { FILTER_DEFAULTS } from "@/lib/constants";
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	useDisclosure,
} from "@heroui/react";
import { FilterIcon } from "lucide-react";
import { Suspense, useEffect } from "react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import JobListSkeleton from "../landing/JobListSkeleton";
import FilterSidebar from "./FilterSidebar";
import SearchJobsList from "./SearchJobsList";

export const SearchPageContentFragment = graphql`
  fragment SearchPageContent_query on Query
  @argumentDefinitions(
    speciality: { type: "String" }
    minExperience: { type: "Int" }
    maxExperience: { type: "Int" }
    minSalary: { type: "Int" }
    maxSalary: { type: "Int" }
    coordinates: { type: "CoordinatesInput" }
    proximityKm: { type: "Float" }
  ) {
    ...SearchJobsListFragment @arguments(
      searchTerm: $speciality
      coordinates: $coordinates
      proximityKm: $proximityKm
      minExperience: $minExperience
      maxExperience: $maxExperience
      minSalary: $minSalary
      maxSalary: $maxSalary
    )
  }
`;

// Valid enum values for validation
const VALID_WORK_MODES = ["ANY", "HYBRID", "OFFICE", "REMOTE"] as const;
const VALID_JOB_TYPES = [
	"ANY",
	"CONTRACT",
	"FULL_TIME",
	"INTERNSHIP",
	"LOCUM",
	"PART_TIME",
] as const;

// Function to validate enum values and return null if invalid
const validateEnum = <T extends string>(
	value: string | null | undefined,
	validValues: readonly T[],
): T | null => {
	if (!value) return null;
	return validValues.includes(value as T) ? (value as T) : null;
};

export default function SearchPageContent({
	queryRef,
	filters,
	setFilters,
}: {
	queryRef: PreloadedQuery<pageSearchQueryType>;
	filters: Filters;
	setFilters: (filters: Filters) => void;
}) {
	const query = usePreloadedQuery(pageSearchQuery, queryRef);
	const data = useFragment<SearchPageContent_query$key>(
		SearchPageContentFragment,
		query,
	);

	// Fix: Only validate and update workMode/jobType if actually needed, and only depend on those fields
	const { workMode, jobType } = filters;

	useEffect(() => {
		const validatedWorkMode = validateEnum(workMode, VALID_WORK_MODES);
		const validatedJobType = validateEnum(jobType, VALID_JOB_TYPES);

		if (validatedWorkMode !== workMode || validatedJobType !== jobType) {
			setFilters({
				...filters,
				workMode: validatedWorkMode || FILTER_DEFAULTS.workMode,
				jobType: validatedJobType || FILTER_DEFAULTS.jobType,
			});
		}
	}, [workMode, jobType, setFilters]);

	// Get validated values for use in render
	const validatedWorkMode = validateEnum(workMode, VALID_WORK_MODES);
	const validatedJobType = validateEnum(jobType, VALID_JOB_TYPES);

	// When passing to FilterSidebar and JobList, treat undefined as null
	const sidebarFilters = {
		...filters,
		minExperience: filters.minExperience ?? null,
		maxExperience: filters.maxExperience ?? null,
		minSalary: filters.minSalary ?? null,
		maxSalary: filters.maxSalary ?? null,
	};

	// Parse coordinates from the string format "latitude,longitude"
	const parseCoordinates = (coordinatesString: string) => {
		if (!coordinatesString) return null;
		const [latitude, longitude] = coordinatesString.split(",").map(Number);
		if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
		return { latitude, longitude };
	};

	// Debounced filter update: update key to force JobList remount/refetch
	// (Optional: If you want to debounce, you can use a useEffect with a timeout)

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 mx-auto max-w-7xl py-6 px-4 bg-background-600">
			{/* Mobile filter button */}
			<div className="block lg:hidden mb-4">
				<Button
					variant="solid"
					startContent={<FilterIcon size={18} />}
					onPress={onOpen}
					fullWidth
				>
					Show Filters
				</Button>
				<Drawer
					isOpen={isOpen}
					onClose={onOpenChange}
					classNames={{
						body: "px-0",
						wrapper: "lg:hidden",
						backdrop: "lg:hidden",
					}}
					placement="bottom"
				>
					<DrawerContent>
						<DrawerHeader>Filters</DrawerHeader>
						<DrawerBody>
							<FilterSidebar
								values={sidebarFilters}
								onChange={setFilters}
								open={true}
								speciality={filters.speciality}
								setSpeciality={(value) =>
									setFilters({ ...filters, speciality: value })
								}
							/>
						</DrawerBody>
					</DrawerContent>
				</Drawer>
			</div>
			{/* Desktop sidebar */}
			<div className="hidden lg:block lg:w-auto lg:sticky lg:top-20 lg:self-start">
				<FilterSidebar
					values={sidebarFilters}
					onChange={setFilters}
					open={true}
					speciality={filters.speciality}
					setSpeciality={(value) =>
						setFilters({ ...filters, speciality: value })
					}
				/>
			</div>
			<div className="flex-1">
				<Suspense fallback={<JobListSkeleton />}>
					<SearchJobsList
						rootQuery={data}
						searchTerm={filters.speciality || null}
						coordinates={parseCoordinates(filters.coordinates)}
						proximityKm={filters.proximityKm}
						minExperience={filters.minExperience ?? null}
						maxExperience={filters.maxExperience ?? null}
						minSalary={filters.minSalary ?? null}
						maxSalary={filters.maxSalary ?? null}
						workMode={validatedWorkMode || FILTER_DEFAULTS.workMode}
						jobType={validatedJobType || FILTER_DEFAULTS.jobType}
					/>
				</Suspense>
			</div>
		</div>
	);
}
