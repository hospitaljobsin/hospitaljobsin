"use client";

import type {
	LocationAutocompleteQuery,
	SearchLocation,
} from "@/__generated__/LocationAutocompleteQuery.graphql";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { AutocompleteProps } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import type { Key } from "react";
import { useCallback, useEffect, useState } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";

interface LocationAutocompleteProps
	extends Omit<AutocompleteProps, "children"> {
	value: string;
	onChange: (value: string) => void;
}

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

// Create a separate component to handle the preloaded query
function LocationResults({
	queryReference,
	setIsLoading,
	setSuggestions,
}: {
	queryReference: PreloadedQuery<LocationAutocompleteQuery>;
	setIsLoading: (loading: boolean) => void;
	setSuggestions: (suggestions: SearchLocation[]) => void;
}) {
	const data = usePreloadedQuery(SearchLocationsQuery, queryReference);

	useEffect(() => {
		if (data && data.searchLocations && data.searchLocations.locations) {
			const mapped = data.searchLocations.locations.map((item) => ({
				id: item.placeId,
				displayName: item.displayName,
				lat: item.latitude,
				lon: item.longitude,
			}));

			setSuggestions(mapped);
		} else {
			setSuggestions([]);
		}
		setIsLoading(false);
	}, [data, setSuggestions, setIsLoading]);

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
		if (!value) {
			onChange("");
		}
	};

	return (
		<>
			{queryReference && (
				<LocationResults
					queryReference={queryReference}
					setIsLoading={setIsLoading}
					setSuggestions={setSuggestions}
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
					<AutocompleteItem key={suggestion.id} value={suggestion.id}>
						{suggestion.displayName}
					</AutocompleteItem>
				))}
			</Autocomplete>
		</>
	);
}
