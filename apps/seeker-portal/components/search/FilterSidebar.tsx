import {
	Button,
	Card,
	CardBody,
	Radio,
	RadioGroup,
	Slider,
} from "@heroui/react";
import { RotateCw } from "lucide-react";
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
};

function toTuple(
	val: number | number[],
	fallback: [number, number],
): [number, number] {
	if (Array.isArray(val)) {
		if (val.length === 2) return [val[0], val[1]];
		if (val.length === 1) return [val[0], val[0]];
		return fallback;
	}
	return [val, val];
}

export default function FilterSidebar({
	values,
	onChange,
}: FilterSidebarProps) {
	console.log("location", values.locationName);
	// Use local state for location input value to prevent search params from updating while typing
	const [locationInput, setLocationInput] = useState(values.locationName);

	return (
		<Card
			className="w-full max-w-xs p-3 flex flex-col gap-4 sticky top-0"
			shadow="none"
		>
			<CardBody className="flex flex-col gap-4">
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
						minValue={1}
						maxValue={200}
						step={1}
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
					onPress={() => onChange({ ...values, minExperience: null })}
					disabled={values.minExperience === null}
				>
					Clear
				</Button>
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
					onPress={() =>
						onChange({ ...values, minSalary: null, maxSalary: null })
					}
					disabled={values.minSalary === null && values.maxSalary === null}
				>
					Clear
				</Button>

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
					startContent={<RotateCw size={18} />}
					onPress={() => {
						setLocationInput("");
						onChange({
							speciality: "",
							minExperience: null,
							minSalary: null,
							maxSalary: null,
							locationName: "",
							coordinates: "",
							proximityKm: 50,
							workMode: "ANY",
							jobType: "ANY",
						});
					}}
				>
					Reset All Filters
				</Button>
			</CardBody>
		</Card>
	);
}
