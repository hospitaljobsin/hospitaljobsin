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

interface LocationAutocompleteProps extends Omit<AutocompleteProps<SearchLocation>, 'children' | 'onChange' | 'onSubmit'> {
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
					displayName: item.address.displayName || null,
					country: item.address.country || null,
					addressLocality: item.address.addressLocality || null,
					addressRegion: item.address.addressRegion || null,
					postalCode: item.address.postalCode || null
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
	// Use a shorter debounce time for more responsive suggestions
	const [debouncedLocation] = useDebounce(value, 250);
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
		if (debouncedLocation && debouncedLocation.length >= 2 && !justSubmitted) {
			setIsLoading(true);

			// Use startTransition to avoid UI jank during data fetching
			startTransition(() => {
				loadQuery(
					{ searchTerm: debouncedLocation },
					{
						fetchPolicy: 'network-only', // Always get fresh data from network
						networkCacheConfig: { force: true }
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
			return;
		}
		const selected = suggestions.find(item => item.placeId === selectedKey);
		if (selected) {
			// Update the parent component with the selected location object
			onChange?.({
				address: selected.address,
				placeId: selected.placeId,
				level: selected.level
			});

			setIsLoading(false);
			disposeQuery();
		}
	};

	const handleInputChange = (value: string) => {
		// Reset justSubmitted when user starts typing again
		if (justSubmitted) {
			setJustSubmitted(false);
		}

		// Clear suggestions when input is empty
		if (value === '') {
			setSuggestions([]);
		}

		// Always update the value
		onValueChange?.(value);
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
			<Autocomplete<SearchLocation>
				{...props}
				ref={inputRef}
				inputValue={value}
				onInputChange={handleInputChange}
				isLoading={isLoading || isPending}
				onSelectionChange={handleSelectionChange}
				onKeyDown={handleKeyDown}
				isClearable
				onClear={onClear}
				onBlur={onBlur}
				items={suggestions}
				menuTrigger='input'
				shouldCloseOnBlur={false}
				allowsEmptyCollection
				autoComplete='off' // Prevent browser autocomplete from interfering
				isVirtualized
				itemHeight={50}
				maxListboxHeight={250}
			>
				{(suggestion: SearchLocation) => (
					<AutocompleteItem key={suggestion.placeId} textValue={suggestion.address.displayName || ''}>
						<div className='flex justify-between items-center w-full py-1.5'>
							<div className='flex flex-col'>
								<span className=''>{suggestion.address.displayName}</span>
								{(suggestion.address.addressLocality ||
									suggestion.address.addressRegion ||
									(suggestion.address.country && suggestion.level.toLowerCase() !== 'country') ||
									suggestion.address.postalCode) && (
									<span className='text-xs text-default-400'>
										{[
											suggestion.address.addressLocality,
											suggestion.address.addressRegion,
											suggestion.address.postalCode,
											suggestion.level.toLowerCase() !== 'country' ? suggestion.address.country : null
										]
											.filter(Boolean)
											.join(', ')}
									</span>
								)}
							</div>
							<span className='text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded ml-2'>{suggestion.level.toLowerCase()}</span>
						</div>
					</AutocompleteItem>
				)}
			</Autocomplete>
		</>
	);
}
