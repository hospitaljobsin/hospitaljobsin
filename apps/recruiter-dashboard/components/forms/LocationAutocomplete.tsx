"use client";

import type { LocationAutocompleteQuery } from "@/__generated__/LocationAutocompleteQuery.graphql";
import type { AutocompleteProps } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import type { Key } from "react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";
import { useDebounce } from "use-debounce";

interface LocationAutocompleteProps
	extends Omit<AutocompleteProps, "children" | "onChange"> {
	value: string;
	onChange: (value: SearchLocation) => void;
	onValueChange: (value: string) => void;
	onClear?: () => void;
}

type SearchLocation = {
	displayName: string;
	placeId: string;
	coordinates: {
		latitude: number;
		longitude: number;
	};
};

const SearchLocationsQuery = graphql`
	query LocationAutocompleteQuery($searchTerm: String!) {
		searchLocations(searchTerm: $searchTerm) {
			locations {
				__typename
				displayName
				placeId
				coordinates {
					latitude
					longitude
				}
			}
		}
	}
`;

// Separate component to handle data fetching using the query reference
function LocationResultControls({
	queryReference,
	onDataLoaded,
}: {
	queryReference: PreloadedQuery<LocationAutocompleteQuery>;
	onDataLoaded: (locations: SearchLocation[]) => void;
}) {
	const data = usePreloadedQuery(SearchLocationsQuery, queryReference);

	useEffect(() => {
		if (data?.searchLocations?.locations) {
			const mappedLocations = data.searchLocations.locations.map((item) => ({
				displayName: item.displayName,
				placeId: item.placeId,
				coordinates: {
					latitude: item.coordinates.latitude,
					longitude: item.coordinates.longitude,
				},
			}));
			onDataLoaded(mappedLocations);
		} else {
			onDataLoaded([]);
		}
	}, [data, onDataLoaded]);

	// This component doesn't render anything visually
	return null;
}

export default function LocationAutocomplete({
	value,
	onChange,
	onClear,
	onValueChange,
	...props
}: LocationAutocompleteProps) {
	const [debouncedLocation] = useDebounce(value, 300);
	const [suggestions, setSuggestions] = useState<SearchLocation[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [queryReference, loadQuery, disposeQuery] =
		useQueryLoader<LocationAutocompleteQuery>(SearchLocationsQuery);

	const shouldRefetchSuggestions = useRef(true);

	const handleDataLoaded = useCallback((locations: SearchLocation[]) => {
		setSuggestions(locations);
		// Make sure loading state is turned off when data is loaded
		setIsLoading(false);
	}, []);

	useEffect(() => {
		if (!shouldRefetchSuggestions.current) {
			shouldRefetchSuggestions.current = true;
			return;
		}
		// Only fetch suggestions if we have a valid query
		if (debouncedLocation && debouncedLocation.length >= 3) {
			setIsLoading(true);
			startTransition(() => {
				loadQuery(
					{ searchTerm: debouncedLocation },
					{ fetchPolicy: "store-or-network" },
				);
			});
		} else {
			// Clear suggestions and loading state for empty or short queries
			setSuggestions([]);
			setIsLoading(false);
			// Make sure to dispose any pending query
			// disposeQuery();
		}

		return () => {
			disposeQuery();
		};
	}, [debouncedLocation, loadQuery, disposeQuery]);

	const handleSelectionChange = (selectedKey: Key | null) => {
		if (!selectedKey) {
			if (onClear) {
				onClear();
			}

			return;
		}
		const selected = suggestions.find((item) => item.placeId === selectedKey);
		if (selected) {
			shouldRefetchSuggestions.current = false;
			onChange(selected);
			setIsLoading(false);
			// Clear query reference to completely stop the loading state
			disposeQuery();
		}
	};

	const handleInputChange = (value: string) => {
		onValueChange(value);
		// Don't call onChange here, only when selection changes
	};

	// Prevent form submission that could cause page refresh
	const preventFormSubmission = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
		}
	};

	return (
		<>
			{queryReference && (
				<LocationResultControls
					queryReference={queryReference}
					onDataLoaded={handleDataLoaded}
				/>
			)}
			<Autocomplete
				{...props}
				inputValue={value}
				onInputChange={handleInputChange}
				isLoading={isLoading || isPending}
				onSelectionChange={handleSelectionChange}
				onKeyDown={preventFormSubmission}
				isClearable
			>
				{suggestions.map((suggestion) => (
					<AutocompleteItem key={suggestion.placeId}>
						{suggestion.displayName}
					</AutocompleteItem>
				))}
			</Autocomplete>
		</>
	);
}
