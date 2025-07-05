import { FILTER_DEFAULTS } from "@/lib/constants";
import {
	Button,
	Card,
	CardBody,
	Input,
	Radio,
	RadioGroup,
	Slider,
} from "@heroui/react";
import { EraserIcon } from "lucide-react";
import { useState } from "react";
import LocationAutocomplete from "../forms/LocationAutocomplete";

export type FilterValues = {
	speciality: string;
	minExperience: number | null;
	minSalary: number | null;
	maxSalary: number | null;
	locationName: string;
	coordinates: string;
	proximityKm: number;
	workMode: string;
	jobType: string;
};

export type FilterSidebarProps = {
	values: FilterValues;
	onChange: (values: FilterValues) => void;
	open?: boolean;
	speciality: string;
	setSpeciality: (value: string) => void;
};

export default function FilterSidebar({
	values,
	onChange,
	open = true,
	speciality,
	setSpeciality,
}: FilterSidebarProps) {
	const [locationInput, setLocationInput] = useState(values.locationName);

	if (!open) return null;

	return (
		<Card
			className="w-full max-w-none lg:max-w-xs p-3 flex flex-col gap-4 lg:sticky lg:top-0"
			shadow="none"
		>
			<CardBody className="flex flex-col gap-12">
				{/* Speciality input for mobile only */}
				<Input
					label="Speciality"
					className="block lg:hidden"
					value={speciality}
					onChange={(e) => setSpeciality(e.target.value)}
					placeholder="e.g. Cardiology"
					variant="bordered"
					fullWidth
				/>
				<LocationAutocomplete
					id="coordinates"
					label="Location"
					value={locationInput}
					onChange={(val) => {
						setLocationInput(val.displayName);
						onChange({
							...values,
							locationName: val.displayName,
							coordinates: `${val.coordinates.latitude},${val.coordinates.longitude}`,
						});
					}}
					onValueChange={(val) => {
						setLocationInput(val);
					}}
					onClear={() => {
						setLocationInput("");
						onChange({ ...values, locationName: "", coordinates: "" });
					}}
					onBlur={() => {
						if (locationInput !== values.locationName) {
							setLocationInput(values.locationName);
						}
					}}
				/>
				{values.locationName && (
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

				<RadioGroup
					label="Work Mode"
					value={values.workMode}
					onValueChange={(value) => onChange({ ...values, workMode: value })}
					className="w-full"
					orientation="horizontal"
				>
					<Radio value="ANY">Any</Radio>
					<Radio value="REMOTE">Remote</Radio>
					<Radio value="HYBRID">Hybrid</Radio>
					<Radio value="OFFICE">Office</Radio>
				</RadioGroup>
				<RadioGroup
					label="Job Type"
					value={values.jobType}
					onValueChange={(value) => onChange({ ...values, jobType: value })}
					className="w-full"
					orientation="horizontal"
				>
					<Radio value="ANY">Any</Radio>
					<Radio value="FULL_TIME">Full Time</Radio>
					<Radio value="PART_TIME">Part Time</Radio>
					<Radio value="INTERNSHIP">Internship</Radio>
					<Radio value="CONTRACT">Contract</Radio>
					<Radio value="LOCUM">Locum</Radio>
				</RadioGroup>

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
					Clear Filters
				</Button>
			</CardBody>
		</Card>
	);
}
