import { FILTER_DEFAULTS } from "@/lib/constants";
import links from "@/lib/links";
import {
	Button,
	Card,
	CardBody,
	Checkbox,
	CheckboxGroup,
	Slider,
} from "@heroui/react";
import { EraserIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import JobSearchAutocomplete from "../forms/JobSearchAutocomplete";
import LocationAutocomplete from "../forms/LocationAutocomplete";

export type FilterValues = {
	q: string | null;
	minExperience: number | null;
	minSalary: number | null;
	maxSalary: number | null;
	proximityKm: number;
	workMode: string[];
	jobType: string[];
	sortBy: string;
};

export type FilterSidebarProps = {
	values: FilterValues;
	location: string | null;
	onChange: (values: FilterValues) => void;
	open?: boolean;
	searchTerm: string | null;
	setSearchTerm: (value: string | null) => void;
};

export default function FilterSidebar({
	values,
	location,
	onChange,
	open = true,
	searchTerm,
}: FilterSidebarProps) {
	const router = useRouter();
	const params = useSearchParams();
	const [locationInput, setLocationInput] = useState(location);
	const [searchInput, setSearchInput] = useState(searchTerm || "");

	// Sync local state when searchTerm changes externally
	useEffect(() => {
		setSearchInput(searchTerm || "");
	}, [searchTerm]);

	if (!open) return null;

	return (
		<Card
			className="w-full max-w-none lg:max-w-xs p-3 flex flex-col gap-4"
			shadow="none"
		>
			<CardBody className="flex flex-col gap-12">
				<div className="block lg:hidden">
					{/* Speciality input for mobile only */}
					<JobSearchAutocomplete
						label="Search"
						value={searchInput}
						onValueChange={setSearchInput}
						onSubmit={(searchTerm: string) => {
							onChange({ ...values, q: searchTerm });
						}}
						onClear={() => {
							setSearchInput("");
							onChange({ ...values, q: "" });
						}}
						placeholder="Search by Speciality or keyword"
						variant="bordered"
						fullWidth
					/>
				</div>
				<LocationAutocomplete
					id="location"
					label="Location"
					value={locationInput || ""}
					onChange={(val) => {
						setLocationInput(val.displayName);
						router.push(
							`${links.search(val.displayName)}?${params.toString()}`,
						);
					}}
					onValueChange={(val) => {
						setLocationInput(val);
					}}
					onClear={() => {
						router.push(`${links.search()}?${params.toString()}`);
					}}
					onBlur={() => {
						if (locationInput !== location) {
							setLocationInput(location);
						}
					}}
				/>
				{location && (
					<Slider
						id="proximityKm"
						label="Proximity"
						formatOptions={{
							style: "unit",
							unit: "kilometer",
						}}
						minValue={0}
						maxValue={200}
						step={10}
						value={values.proximityKm}
						onChange={(val) =>
							onChange({
								...values,
								proximityKm: Array.isArray(val) ? val[0] : val,
							})
						}
						showTooltip
						className="w-full"
					/>
				)}
				<div className="w-full flex flex-col gap-6">
					<Slider
						id="minExperience"
						label="Experience"
						formatOptions={{
							style: "unit",
							unit: "year",
						}}
						minValue={0}
						maxValue={30}
						step={1}
						value={values.minExperience ?? 0}
						onChange={(val) => {
							const v = Array.isArray(val) ? val[0] : val;
							onChange({ ...values, minExperience: v });
						}}
						showTooltip
						className="w-full"
					/>
					<Button
						size="sm"
						variant="ghost"
						className="w-full min-h-10 text-sm"
						onPress={() => onChange({ ...values, minExperience: null })}
						isDisabled={values.minExperience === null}
					>
						Clear
					</Button>
				</div>
				<div className="w-full flex flex-col gap-6">
					<Slider
						id="salary"
						label="Salary"
						minValue={0}
						maxValue={500000}
						formatOptions={{
							style: "currency",
							currency: "INR",
						}}
						step={1000}
						value={[values.minSalary ?? 0, values.maxSalary ?? 500000]}
						onChange={(val) => {
							const [min, max] = Array.isArray(val) ? val : [val, val];
							onChange({
								...values,
								minSalary: min,
								maxSalary: max,
							});
						}}
						showTooltip
						className="w-full"
					/>
					<Button
						size="sm"
						variant="ghost"
						className="w-full min-h-10 text-sm"
						onPress={() =>
							onChange({ ...values, minSalary: null, maxSalary: null })
						}
						isDisabled={values.minSalary === null && values.maxSalary === null}
					>
						Clear
					</Button>
				</div>

				<CheckboxGroup
					label="Work Mode"
					value={values.workMode}
					onValueChange={(value) => onChange({ ...values, workMode: value })}
					className="w-full"
					orientation="horizontal"
				>
					<Checkbox value="REMOTE">Remote</Checkbox>
					<Checkbox value="HYBRID">Hybrid</Checkbox>
					<Checkbox value="OFFICE">Office</Checkbox>
				</CheckboxGroup>
				<CheckboxGroup
					label="Job Type"
					value={values.jobType}
					onValueChange={(value) => onChange({ ...values, jobType: value })}
					className="w-full"
					orientation="horizontal"
				>
					<Checkbox value="FULL_TIME">Full Time</Checkbox>
					<Checkbox value="PART_TIME">Part Time</Checkbox>
					<Checkbox value="INTERNSHIP">Internship</Checkbox>
					<Checkbox value="CONTRACT">Contract</Checkbox>
					<Checkbox value="LOCUM">Locum</Checkbox>
				</CheckboxGroup>

				<Button
					className="w-full mt-2"
					variant="solid"
					size="md"
					startContent={<EraserIcon size={18} />}
					onPress={() => {
						setLocationInput("");
						onChange(FILTER_DEFAULTS);
					}}
				>
					Clear All Filters
				</Button>
			</CardBody>
		</Card>
	);
}
