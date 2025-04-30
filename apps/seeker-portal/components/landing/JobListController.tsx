import type { CoordinatesInput } from "@/__generated__/LandingViewQuery.graphql";
import LocationAutocomplete from "@/components/forms/LocationAutocomplete";
import { Card, CardBody, Input, Slider } from "@heroui/react";
import { MapPin, Search } from "lucide-react";
import { type FormEvent, useState } from "react";

interface JobListControllerProps {
	coordinates: CoordinatesInput | null;
	setCoordinates: (searchTerm: CoordinatesInput | null) => void;
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

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
			<Input
				size="lg"
				classNames={{
					inputWrapper: "p-4 sm:p-8 bg-background",
					mainWrapper: "mt-4 sm:-mt-20",
				}}
				startContent={
					<Search
						size={24}
						className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-4"
					/>
				}
				isClearable
				placeholder="Search for your next job"
				variant="bordered"
				value={props.searchTerm || ""}
				onValueChange={(value) => props.setSearchTerm(value)}
				onClear={() => props.setSearchTerm(null)}
				fullWidth
			/>

			<div className="flex gap-4 w-full">
				<Card className="w-full" shadow="sm">
					<CardBody className="p-4">
						<div className="flex flex-col sm:flex-row gap-8 w-full items-center">
							<LocationAutocomplete
								className="flex-1"
								size="md"
								placeholder="Filter by location"
								startContent={
									<MapPin size={18} className="text-foreground-400" />
								}
								value={location || ""}
								onChange={(value) => {
									setLocation(value.displayName);
									props.setCoordinates(value.coordinates);
								}}
								onClear={() => {
									setLocation(null);
									props.setCoordinates(null);
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
									className="max-w-md w-full"
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
