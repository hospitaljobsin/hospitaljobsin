'use client';

import type { LocationAutocompleteQuery } from '@/__generated__/LocationAutocompleteQuery.graphql';
import type { AutocompleteProps } from '@heroui/react';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import type { Key } from 'react';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import type { PreloadedQuery } from 'react-relay';
import { usePreloadedQuery, useQueryLoader } from 'react-relay';
import { graphql } from 'relay-runtime';
import { useDebounce } from 'use-debounce';

interface LocationAutocompleteProps extends Omit<AutocompleteProps, 'children' | 'onChange' | 'onSubmit'> {
	value: string;
	onChange?: (value: SearchLocation) => void;
	onValueChange: (value: string) => void;
	onSubmit?: (searchTerm: string) => void;
	onClear?: () => void;
}

export type SearchLocation = {
	address: {
		displayName: string | null;
		country: string | null;
		addressLocality: string | null;
		addressRegion: string | null;
		postalCode: string | null;
	};
	placeId: string;
	level: string;
};

const SearchLocationsQuery = graphql`
	query LocationAutocompleteQuery($searchTerm: String!) {
		autocompleteLocations(searchTerm: $searchTerm) {
			locations {
				__typename
				address {
					displayName
					country
					addressLocality
					addressRegion
					postalCode
				}
				level
				placeId
			}
		}
	}
`;

// Separate component to handle data fetching using the query reference
function LocationResultControls({
	queryReference,
	onDataLoaded
}: {
	queryReference: PreloadedQuery<LocationAutocompleteQuery>;
	onDataLoaded: (locations: SearchLocation[]) => void;
}) {
	const data = usePreloadedQuery(SearchLocationsQuery, queryReference);

	useEffect(() => {
		if (data?.autocompleteLocations?.locations) {
			const mappedLocations = data.autocompleteLocations.locations.map(item => ({
				address: {
					displayName: item.address.displayName,
					country: item.address.country,
					addressLocality: item.address.addressLocality,
					addressRegion: item.address.addressRegion,
					postalCode: item.address.postalCode
				},
				placeId: item.placeId,
				level: item.level
			}));
			onDataLoaded(mappedLocations);
		} else {
			onDataLoaded([]);
		}
	}, [data, onDataLoaded]);

	// This component doesn't render anything visually
	return null;
}

export default function LocationAutocomplete({ value, onChange, onClear, onValueChange, onSubmit, ...props }: LocationAutocompleteProps) {
	const [debouncedLocation] = useDebounce(value, 300);
	const [suggestions, setSuggestions] = useState<SearchLocation[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [justSubmitted, setJustSubmitted] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [queryReference, loadQuery, disposeQuery] = useQueryLoader<LocationAutocompleteQuery>(SearchLocationsQuery);

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
		// Only fetch suggestions if we have a valid query and haven't just submitted
		if (debouncedLocation && debouncedLocation.length >= 3 && !justSubmitted) {
			setIsLoading(true);
			startTransition(() => {
				loadQuery(
					{ searchTerm: debouncedLocation },
					{
						fetchPolicy: 'store-or-network',
						networkCacheConfig: { force: false }
					}
				);
			});
		} else {
			// Clear suggestions and loading state for empty or short queries
			setSuggestions([]);
			setIsLoading(false);
			disposeQuery();
		}

		return () => {
			disposeQuery();
		};
	}, [debouncedLocation, loadQuery, disposeQuery, justSubmitted]);

	const handleSelectionChange = (selectedKey: Key | null) => {
		if (!selectedKey) {
			// Do nothing on blur or deselection
			return;
		}
		const selected = suggestions.find(item => item.placeId === selectedKey);
		if (selected) {
			shouldRefetchSuggestions.current = false;
			onChange?.({
				address: selected.address,
				placeId: selected.placeId,
				level: selected.level
			});
			onSubmit?.(selected.address.displayName);
			setIsLoading(false);
			// Clear query reference to completely stop the loading state
			disposeQuery();
		}
	};

	const handleInputChange = (value: string) => {
		// Reset justSubmitted when user starts typing again
		if (justSubmitted) {
			setJustSubmitted(false);
		}
		onValueChange(value);
		// Don't call onChange here, only when selection changes
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			setJustSubmitted(true);
			onSubmit?.(value);

			// Blur the input to remove focus
			inputRef.current?.blur();

			// Reset the flag after a short delay to allow typing again
			setTimeout(() => {
				setJustSubmitted(false);
			}, 500);
		}
	};

	const onBlur = () => {
		if (value === '') {
			onClear?.();
		}
	};

	return (
		<>
			{queryReference && <LocationResultControls queryReference={queryReference} onDataLoaded={handleDataLoaded} />}
			<Autocomplete
				{...props}
				ref={inputRef}
				inputValue={value}
				onInputChange={handleInputChange}
				isLoading={isLoading || isPending}
				onSelectionChange={handleSelectionChange}
				onKeyDown={handleKeyDown}
				isClearable
				menuTrigger='input'
				onClear={onClear}
				onBlur={onBlur}
			>
				{suggestions.map(suggestion => (
					<AutocompleteItem key={suggestion.placeId}>{suggestion.address.displayName}</AutocompleteItem>
				))}
			</Autocomplete>
		</>
	);
}
