"use client";
// @ts-ignore: HeroUI types may be missing, but usage is required by project rules
import { Button, Card, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SearchLocation } from "../forms/LocationAutocomplete";
import LocationAutocomplete from "../forms/LocationAutocomplete";

export function LandingSearchController() {
	const router = useRouter();
	const [speciality, setSpeciality] = useState("");
	const [locationInput, setLocationInput] = useState("");
	const [selectedLocation, setSelectedLocation] =
		useState<SearchLocation | null>(null);
	const [experience, setExperience] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (speciality) params.set("speciality", speciality);
		if (selectedLocation?.displayName) {
			params.set("location", selectedLocation.displayName);
			if (selectedLocation.coordinates) {
				params.set(
					"coordinates",
					`${selectedLocation.coordinates.latitude},${selectedLocation.coordinates.longitude}`,
				);
			}
		}
		if (experience) params.set("experience", experience);
		router.push(`/search?${params.toString()}`);
	};

	return (
		<Card className="p-6" shadow="none" fullWidth>
			<form
				onSubmit={handleSubmit}
				className="w-full rounded-lg flex flex-col gap-12"
			>
				<div className="w-full flex flex-col sm:flex-row gap-4">
					<Input
						id="speciality"
						name="speciality"
						label="Speciality"
						placeholder="e.g. Cardiologist"
						value={speciality}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSpeciality(e.target.value)
						}
						isRequired
					/>
					<LocationAutocomplete
						id="location"
						name="location"
						label="Location"
						placeholder="e.g. Mumbai, Delhi, Bangalore"
						value={locationInput}
						onValueChange={setLocationInput}
						onChange={(loc) => {
							setSelectedLocation(loc);
							setLocationInput(loc.displayName);
						}}
					/>
					<Input
						id="experience"
						name="experience"
						label="Experience (in years)"
						type="number"
						min="0"
						placeholder="e.g. 3"
						value={experience}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setExperience(e.target.value)
						}
					/>
				</div>
				<Button type="submit" fullWidth size="lg">
					Search Jobs
				</Button>
			</form>
		</Card>
	);
}
