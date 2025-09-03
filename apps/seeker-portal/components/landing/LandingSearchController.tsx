"use client";
import links from "@/lib/links";
// @ts-ignore: HeroUI types may be missing, but usage is required by project rules
import { Button, Card } from "@heroui/react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import JobSearchAutocomplete from "../forms/JobSearchAutocomplete";
import type { SearchLocation } from "../forms/LocationAutocomplete";
import LocationAutocomplete from "../forms/LocationAutocomplete";

export function LandingSearchController({
	isDisabled,
}: { isDisabled?: boolean }) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [locationInput, setLocationInput] = useState("");
	const [selectedLocation, setSelectedLocation] =
		useState<SearchLocation | null>(null);

	const handleJobClear = () => {
		setSearchTerm("");
	};

	const handleAutocompleteSearchSubmit = () => {
		// No-op function - don't submit form on autocomplete selection
		// Form should only submit when Search Jobs button is clicked
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (searchTerm) params.set("q", searchTerm);
		if (selectedLocation?.displayName) {
			router.push(
				`${links.search(selectedLocation.displayName)}?${params.toString()}`,
			);
			return;
		}
		router.push(`${links.search()}?${params.toString()}`);
	};

	return (
		<Card className="p-6" shadow="none" fullWidth>
			<form
				onSubmit={handleSubmit}
				className="w-full rounded-lg flex flex-col gap-6"
			>
				<div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6">
					<JobSearchAutocomplete
						name="searchTerm"
						label="Search by"
						variant="underlined"
						placeholder="Speciality, Keyword or Company"
						value={searchTerm}
						isDisabled={isDisabled}
						onChange={() => {}}
						onValueChange={setSearchTerm}
						onSearchSubmit={handleAutocompleteSearchSubmit}
						onClear={handleJobClear}
					/>
					<LocationAutocomplete
						id="location"
						name="location"
						label="Location"
						placeholder="e.g. Chennai"
						variant="underlined"
						value={locationInput}
						isDisabled={isDisabled}
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
					isDisabled={isDisabled}
				>
					Search Jobs
				</Button>
			</form>
		</Card>
	);
}
