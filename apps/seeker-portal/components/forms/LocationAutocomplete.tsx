"use client";

import type { LocationAutocompleteQuery } from "@/__generated__/LocationAutocompleteQuery.graphql";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { AutocompleteProps } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import type { Key } from "react";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";

// TODO: remodel this component based on https://github.com/Amraneze/osm-autocomplete
interface LocationAutocompleteProps
    extends Omit<AutocompleteProps, "children" | "onChange"> {
    value: string;
    onChange: (value: string) => void;
}

type SearchLocation = {
    displayName: string;
    lat: number;
    lon: number;
};

const SearchLocationsQuery = graphql`
    query LocationAutocompleteQuery($searchTerm: String!) {
        searchLocations(searchTerm: $searchTerm) {
            locations {
                __typename
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
    const [isPending, startTransition] = useTransition();

    const [queryReference, loadQuery, disposeQuery] =
        useQueryLoader<LocationAutocompleteQuery>(SearchLocationsQuery);

    const handleDataLoaded = useCallback((locations: SearchLocation[]) => {
        setSuggestions(locations);
        // Make sure loading state is turned off when data is loaded
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Only fetch suggestions if we have a valid query
        if (debouncedQuery && debouncedQuery.length >= 3) {
            setIsLoading(true);
            startTransition(() => {
                loadQuery({ searchTerm: debouncedQuery }, { fetchPolicy: "store-or-network" });
            });
        } else {
            // Clear suggestions and loading state for empty or short queries
            setSuggestions([]);
            setIsLoading(false);
            // Make sure to dispose any pending query
            disposeQuery();
        }

        // Cleanup function
        return () => {
            disposeQuery();
        };
    }, [debouncedQuery, loadQuery, disposeQuery]);

    const handleSelectionChange = (selectedKey: Key | null) => {
        const selected = suggestions.find((item) => item.displayName === selectedKey);
        if (selected) {
            setInputValue(selected.displayName);
            onChange(selected.displayName);
            setIsLoading(false);
            // Clear query reference to completely stop the loading state
            disposeQuery();
        }
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
        // Don't call onChange here, only when selection changes
    };

    // Prevent form submission that could cause page refresh
    const preventFormSubmission = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
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
                inputValue={inputValue}
                onInputChange={handleInputChange}
                isLoading={isLoading || isPending}
                onSelectionChange={handleSelectionChange}
                onKeyDown={preventFormSubmission}
            >
                {suggestions.map((suggestion) => (
                    <AutocompleteItem key={suggestion.displayName}>
                        {suggestion.displayName}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </>
    );
}