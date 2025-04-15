"use client";

import type { LocationAutocompleteQuery } from "@/__generated__/LocationAutocompleteQuery.graphql";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { AutocompleteProps } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import type { Key } from "react";
import { useCallback, useEffect, useState } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";

interface LocationAutocompleteProps
	extends Omit<AutocompleteProps, "children" | "onChange"> {
	value: string;
	onChange: (value: string) => void;
}

type SearchLocation = {
	id: number;
	displayName: string;
	lat: number;
	lon: number;
};

const SearchLocationsQuery = graphql`
    query LocationAutocompleteQuery($searchTerm: String!) {
        searchLocations(searchTerm: $searchTerm) {
            locations {
                __typename
                placeId
                displayName
                latitude
                longitude
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
				id: item.placeId,
				displayName: item.displayName,
				lat: item.latitude,
				lon: item.longitude,
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
	...props
}: LocationAutocompleteProps) {
	const [inputValue, setInputValue] = useState(value);
	const [suggestions, setSuggestions] = useState<SearchLocation[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const debouncedQuery = useDebounce(inputValue, 300);

	const [queryReference, loadQuery, disposeQuery] =
		useQueryLoader<LocationAutocompleteQuery>(SearchLocationsQuery);

	const handleDataLoaded = useCallback((locations: SearchLocation[]) => {
		setSuggestions(locations);
		setIsLoading(false);
	}, []);

	const fetchSuggestions = useCallback(
		(query: string) => {
			if (!query || query.length < 3) {
				setSuggestions([]);
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			loadQuery({ searchTerm: query }, { fetchPolicy: "store-or-network" });
		},
		[loadQuery],
	);

	useEffect(() => {
		fetchSuggestions(debouncedQuery);

		// Cleanup function
		return () => {
			disposeQuery();
		};
	}, [debouncedQuery, fetchSuggestions, disposeQuery]);

	const handleSelectionChange = (selectedKey: Key | null) => {
		const selected = suggestions.find((item) => item.id === selectedKey);
		if (selected) {
			setInputValue(selected.displayName);
			onChange(selected.displayName);
		}
	};

	const handleInputChange = (value: string) => {
		setInputValue(value);
		// Always call onChange to ensure form state is updated
		onChange(value);
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
				inputValue={inputValue}
				onInputChange={handleInputChange}
				isLoading={isLoading}
				onSelectionChange={handleSelectionChange}
			>
				{suggestions.map((suggestion) => (
					<AutocompleteItem key={suggestion.id}>
						{suggestion.displayName}
					</AutocompleteItem>
				))}
			</Autocomplete>
		</>
	);
}
