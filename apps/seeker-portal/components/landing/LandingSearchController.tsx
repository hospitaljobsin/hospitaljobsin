"use client";
// @ts-ignore: HeroUI types may be missing, but usage is required by project rules
import { Button, Card, Input } from "@heroui/react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SearchLocation } from "../forms/LocationAutocomplete";
import LocationAutocomplete from "../forms/LocationAutocomplete";

export function LandingSearchController() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [locationInput, setLocationInput] = useState("");
	const [selectedLocation, setSelectedLocation] =
		useState<SearchLocation | null>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (searchTerm) params.set("q", searchTerm);
		if (selectedLocation?.displayName) {
			params.set("locationName", selectedLocation.displayName);
			if (selectedLocation.coordinates) {
				params.set(
					"coordinates",
					`${selectedLocation.coordinates.latitude},${selectedLocation.coordinates.longitude}`,
				);
			}
		}
		router.push(`/search?${params.toString()}`);
	};

	return (
		<Card className="p-6" shadow="none" fullWidth>
			<form
				onSubmit={handleSubmit}
				className="w-full rounded-lg flex flex-col gap-6"
			>
				<div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6">
					<Input
						name="searchTerm"
						label="Search by"
						variant="underlined"
						placeholder="Speciality, Keyword or Company"
						value={searchTerm}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSearchTerm(e.target.value)
						}
						isRequired
						isClearable
						onClear={() => setSearchTerm("")}
					/>
					<LocationAutocomplete
						id="location"
						name="location"
						label="Location"
						placeholder="e.g. Chennai"
						variant="underlined"
						value={locationInput}
						onValueChange={setLocationInput}
						onChange={(loc) => {
							setSelectedLocation(loc);
							setLocationInput(loc.displayName);
						}}
					/>
				</div>
				<Button
					type="submit"
					className="min-w-44"
					color="primary"
					size="lg"
					startContent={<SearchIcon />}
				>
					Search Jobs
				</Button>
			</form>
		</Card>
	);
}
