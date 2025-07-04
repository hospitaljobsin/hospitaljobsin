import { Button, Card, CardBody, Slider } from "@heroui/react";
import LocationAutocomplete from "../forms/LocationAutocomplete";

export type FilterValues = {
	speciality: string;
	minExperience: number | null;
	maxExperience: number | null;
	minSalary: number | null;
	maxSalary: number | null;
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
							value={values.minExperience ?? 0}
							onChange={(val: number | number[]) => {
								const v = Array.isArray(val) ? val[0] : val;
								onChange({ ...values, minExperience: v });
							}}
							aria-valuetext={
								values.minExperience === null
									? "Any"
									: String(values.minExperience)
							}
						/>
						<Button
							size="sm"
							variant="ghost"
							onPress={() => onChange({ ...values, minExperience: null })}
							disabled={values.minExperience === null}
						>
							Clear
						</Button>
						<span className="text-xs">Max</span>
						<Slider
							id="maxExperience"
							minValue={0}
							maxValue={30}
							step={1}
							value={values.maxExperience ?? 0}
							onChange={(val: number | number[]) => {
								const v = Array.isArray(val) ? val[0] : val;
								onChange({ ...values, maxExperience: v });
							}}
							aria-valuetext={
								values.maxExperience === null
									? "Any"
									: String(values.maxExperience)
							}
						/>
						<Button
							size="sm"
							variant="ghost"
							onPress={() => onChange({ ...values, maxExperience: null })}
							disabled={values.maxExperience === null}
						>
							Clear
						</Button>
					</div>
				</div>
				<div>
					<label htmlFor="minSalary" className="block text-sm font-medium mb-1">
						Salary (₹/year)
					</label>
					<div className="flex items-center gap-2">
						<span className="text-xs">Min</span>
						<Slider
							id="minSalary"
							minValue={0}
							maxValue={500000}
							step={1000}
							value={values.minSalary ?? 0}
							onChange={(val: number | number[]) => {
								const v = Array.isArray(val) ? val[0] : val;
								onChange({ ...values, minSalary: v });
							}}
							aria-valuetext={
								values.minSalary === null ? "Any" : String(values.minSalary)
							}
						/>
						<Button
							size="sm"
							variant="ghost"
							onPress={() => onChange({ ...values, minSalary: null })}
							disabled={values.minSalary === null}
						>
							Clear
						</Button>
						<span className="text-xs">Max</span>
						<Slider
							id="maxSalary"
							minValue={0}
							maxValue={500000}
							step={1000}
							value={values.maxSalary ?? 0}
							onChange={(val: number | number[]) => {
								const v = Array.isArray(val) ? val[0] : val;
								onChange({ ...values, maxSalary: v });
							}}
							aria-valuetext={
								values.maxSalary === null ? "Any" : String(values.maxSalary)
							}
						/>
						<Button
							size="sm"
							variant="ghost"
							onPress={() => onChange({ ...values, maxSalary: null })}
							disabled={values.maxSalary === null}
						>
							Clear
						</Button>
					</div>
				</div>
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
						onChange={(val) => onChange({ ...values, coordinates: val })}
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
