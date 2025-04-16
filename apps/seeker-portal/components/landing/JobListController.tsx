import LocationAutocomplete from "@/components/forms/LocationAutocomplete";
import { Card, CardBody, Input, Slider } from "@heroui/react";
import { MapPin, Search } from "lucide-react";
import { FormEvent } from "react";

interface JobListControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
	location: string | null;
	setLocation: (location: string | null) => void;
	proximityKm: number | null;
	setProximityKm: (proximityKm: number | null) => void;
}

export default function JobListController(props: JobListControllerProps) {
	// Prevent form submission when pressing Enter
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
	};

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
				placeholder="Search for jobs, in plain English"
				variant="bordered"
				value={props.searchTerm || ""}
				onValueChange={(value) => props.setSearchTerm(value)}
				onClear={() => props.setSearchTerm(null)}
				fullWidth
			/>

			<div className="flex gap-4 w-full">
				<Card className="w-full" shadow="none">
					<CardBody className="p-4">
						<div className="flex flex-col sm:flex-row gap-4 w-full">
							<div className="flex-1">
								<LocationAutocomplete
									label="Location"
									placeholder="Enter city, state, or zip"
									startContent={
										<MapPin size={18} className="text-default-400" />
									}
									value={props.location || ""}
									onChange={(value) => props.setLocation(value)}
									fullWidth
								/>
							</div>
							<div className="flex-1">
								<div className="flex flex-col gap-2">
									<label className="text-sm text-foreground-500">
										Distance (km): {props.proximityKm ?? 0}
									</label>
									<Slider
										size="sm"
										step={5}
										minValue={0}
										maxValue={100}
										value={props.proximityKm || 0}
										onChange={(value) => props.setProximityKm(value as number)}
										className="max-w-md"
										showOutline={true}
										tooltipProps={{
											offset: 10,
											placement: "top",
											content: `${props.proximityKm || 0} km`,
										}}
										formatOptions={{ style: "unit", unit: "kilometer" }}
									/>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
			</form>
	);
}
