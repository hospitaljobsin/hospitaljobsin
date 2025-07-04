import { Card, CardBody, Input, Slider } from "@heroui/react";
import LocationAutocomplete from "../forms/LocationAutocomplete";

export type FilterValues = {
	speciality: string;
	minExperience: number;
	maxExperience: number;
	minSalary: number;
	maxSalary: number;
	coordinates: string;
	proximityKm: number;
};

export type FilterSidebarProps = {
	values: FilterValues;
	onChange: (values: FilterValues) => void;
};

export default function FilterSidebar({
	values,
	onChange,
}: FilterSidebarProps) {
	return (
		<Card className="w-72 p-4 flex flex-col gap-6 sticky top-0" shadow="none">
			<CardBody className="flex flex-col gap-6">
				<div>
					<label
						htmlFor="speciality"
						className="block text-sm font-medium mb-1"
					>
						Speciality
					</label>
					<Input
						id="speciality"
						value={values.speciality}
						onChange={(e) =>
							onChange({ ...values, speciality: e.target.value })
						}
						placeholder="e.g. Cardiology"
						autoComplete="off"
					/>
				</div>
				<div>
					<label
						htmlFor="minExperience"
						className="block text-sm font-medium mb-1"
					>
						Experience (years)
					</label>
					<div className="flex items-center gap-2">
						<span className="text-xs">Min</span>
						<Slider
							id="minExperience"
							minValue={0}
							maxValue={30}
							step={1}
							value={values.minExperience}
							onChange={(val) =>
								onChange({
									...values,
									minExperience: Array.isArray(val) ? val[0] : val,
								})
							}
						/>
						<span className="text-xs">{values.minExperience}</span>
					</div>
					<div className="flex items-center gap-2 mt-2">
						<span className="text-xs">Max</span>
						<Slider
							id="maxExperience"
							minValue={0}
							maxValue={30}
							step={1}
							value={values.maxExperience}
							onChange={(val) =>
								onChange({
									...values,
									maxExperience: Array.isArray(val) ? val[0] : val,
								})
							}
						/>
						<span className="text-xs">{values.maxExperience}</span>
					</div>
				</div>
				<div>
					<label htmlFor="minSalary" className="block text-sm font-medium mb-1">
						Salary (₹/month)
					</label>
					<div className="flex items-center gap-2">
						<span className="text-xs">Min</span>
						<Slider
							id="minSalary"
							minValue={0}
							maxValue={500000}
							step={1000}
							value={values.minSalary}
							onChange={(val) =>
								onChange({
									...values,
									minSalary: Array.isArray(val) ? val[0] : val,
								})
							}
						/>
						<span className="text-xs">
							₹{values.minSalary.toLocaleString()}
						</span>
					</div>
					<div className="flex items-center gap-2 mt-2">
						<span className="text-xs">Max</span>
						<Slider
							id="maxSalary"
							minValue={0}
							maxValue={500000}
							step={1000}
							value={values.maxSalary}
							onChange={(val) =>
								onChange({
									...values,
									maxSalary: Array.isArray(val) ? val[0] : val,
								})
							}
						/>
						<span className="text-xs">
							₹{values.maxSalary.toLocaleString()}
						</span>
					</div>
				</div>
				<div>
					<label
						htmlFor="location-autocomplete"
						className="block text-sm font-medium mb-1"
					>
						Location
					</label>
					<LocationAutocomplete
						value={values.coordinates}
						onValueChange={(val) => onChange({ ...values, coordinates: val })}
						onChange={(loc) =>
							onChange({
								...values,
								coordinates: loc
									? `${loc.coordinates.latitude},${loc.coordinates.longitude}`
									: "",
							})
						}
						id="location-autocomplete"
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
					/>
					<div className="text-xs text-muted-foreground mt-1">
						{values.proximityKm} km
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
