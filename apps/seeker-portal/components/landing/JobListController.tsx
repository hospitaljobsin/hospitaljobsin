import JobSearchAutocomplete, {
	type SearchJob,
} from "@/components/forms/JobSearchAutocomplete";
import LocationAutocomplete from "@/components/forms/LocationAutocomplete";
import { Card, CardBody, Slider } from "@heroui/react";
import { MapPin, Search } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

interface JobListControllerProps {
	searchTerm: string | null;
	setSearchTerm: (location: string | null) => void;
	proximityKm: number | null;
	setProximityKm: (proximityKm: number | null) => void;
}

export default function JobListController(props: JobListControllerProps) {
	// Prevent form submission when pressing Enter
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
	};

	const [location, setLocation] = useState<string | null>(null);
	const [searchInputValue, setSearchInputValue] = useState(
		props.searchTerm || "",
	);

	// Keep input value in sync with search term prop
	useEffect(() => {
		setSearchInputValue(props.searchTerm || "");
	}, [props.searchTerm]);

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
			<JobSearchAutocomplete
				size="lg"
				inputProps={{
					classNames: {
						base: "p-4 sm:p-8 bg-background",
					},
				}}
				className="mt-4 sm:-mt-20"
				startContent={
					<Search
						size={24}
						className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-4"
					/>
				}
				placeholder="Search for your next job"
				variant="bordered"
				value={searchInputValue}
				onChange={(job: SearchJob) => {
					setSearchInputValue(job.displayName);
				}}
				onValueChange={setSearchInputValue}
				onSearchSubmit={(searchTerm) => props.setSearchTerm(searchTerm)}
				onClear={() => {
					setSearchInputValue("");
					props.setSearchTerm(null);
				}}
				fullWidth
			/>

			<div className="flex gap-4 w-full">
				<Card className="w-full" shadow="sm">
					<CardBody className="p-4">
						<div className="flex flex-col sm:flex-row gap-8 w-full items-center">
							<LocationAutocomplete
								className="flex-1"
								size="md"
								aria-label="Location"
								placeholder="Filter by location"
								startContent={
									<MapPin size={18} className="text-foreground-400" />
								}
								value={location || ""}
								onChange={(value) => {
									setLocation(value.displayName);
								}}
								onValueChange={(value) => {
									setLocation(value);
								}}
								onClear={() => {
									setLocation(null);
								}}
								fullWidth
							/>
							<div className="flex-1 w-full">
								<Slider
									label="Proximity"
									radius="lg"
									size="sm"
									step={5}
									minValue={0}
									maxValue={100}
									value={props.proximityKm || 1}
									onChange={(value) => props.setProximityKm(value as number)}
									className="w-full"
									showOutline
									formatOptions={{ style: "unit", unit: "kilometer" }}
								/>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</form>
	);
}
