import { Button, Card, CardBody, Slider } from "@heroui/react";
import LocationAutocomplete from "../forms/LocationAutocomplete";

export type FilterValues = {
	speciality: string;
	minExperience: number | null;
	minSalary: number | null;
	maxSalary: number | null;
	coordinates: string;
	proximityKm: number;
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
	return (
		<Card
			className="w-full max-w-xs p-3 flex flex-col gap-4 sticky top-0"
			shadow="none"
		>
			<CardBody className="flex flex-col gap-4">
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
				<div>
					<label
						htmlFor="coordinates"
						className="block text-sm font-medium mb-1"
					>
						Location
					</label>
					<LocationAutocomplete
						id="coordinates"
						value={values.coordinates}
						onChange={(val) =>
							onChange({ ...values, coordinates: val.displayName })
						}
						onValueChange={(val) => onChange({ ...values, coordinates: val })}
					/>
				</div>
				<div>
					<label
						htmlFor="proximityKm"
						className="block text-sm font-medium mb-1"
					>
						Proximity (km)
					</label>
					<Slider
						id="proximityKm"
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
					<div className="text-xs text-muted-foreground mt-1">
						{values.proximityKm} km
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
