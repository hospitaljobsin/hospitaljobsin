import {
	Button,
	Card,
	CardBody,
	Checkbox,
	CheckboxGroup,
	Input,
	Slider,
} from "@heroui/react";
import { EraserIcon } from "lucide-react";
import LocationAutocomplete from "../forms/LocationAutocomplete";

export default function FilterSidebarSkeleton() {
	return (
		<Card
			className="w-full max-w-none lg:max-w-xs p-3 flex flex-col gap-4 lg:sticky lg:top-0"
			shadow="none"
		>
			<CardBody className="flex flex-col gap-12">
				{/* Speciality input for mobile only */}
				<Input
					label="Search"
					className="block lg:hidden"
					isDisabled
					placeholder="Search by speciality, keyword or company"
					variant="bordered"
					fullWidth
				/>
				<LocationAutocomplete
					id="location"
					label="Location"
					isDisabled
					placeholder="Location"
					variant="bordered"
					fullWidth
					value={""}
					onChange={() => {}}
					onValueChange={() => {}}
				/>
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
					isDisabled
					showTooltip
					className="w-full"
				/>
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
						isDisabled
						showTooltip
						className="w-full"
					/>
					<Button
						size="sm"
						variant="ghost"
						className="w-full min-h-10 text-sm"
						isDisabled
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
						isDisabled
						showTooltip
						className="w-full"
					/>
					<Button
						size="sm"
						variant="ghost"
						className="w-full min-h-10 text-sm"
						isDisabled
					>
						Clear
					</Button>
				</div>

				<CheckboxGroup
					label="Work Mode"
					isDisabled
					className="w-full"
					orientation="horizontal"
				>
					<Checkbox value="REMOTE">Remote</Checkbox>
					<Checkbox value="HYBRID">Hybrid</Checkbox>
					<Checkbox value="OFFICE">Office</Checkbox>
				</CheckboxGroup>
				<CheckboxGroup
					label="Job Type"
					isDisabled
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
					isDisabled
				>
					Clear All Filters
				</Button>
			</CardBody>
		</Card>
	);
}
