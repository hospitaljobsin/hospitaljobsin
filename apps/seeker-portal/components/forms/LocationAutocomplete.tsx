'use client';

import type { AutocompleteProps } from '@heroui/react';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import type { Key } from 'react';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import type { PreloadedQuery } from 'react-relay';
import { usePreloadedQuery, useQueryLoader } from 'react-relay';
import { graphql } from 'relay-runtime';
import { useDebounce } from 'use-debounce';
import type { LocationAutocompleteQuery } from '@/__generated__/LocationAutocompleteQuery.graphql';

interface LocationAutocompleteProps
	extends Omit<
		AutocompleteProps<SearchLocation>,
		'children' | 'items' | 'inputValue' | 'onInputChange' | 'onSelectionChange' | 'isLoading' | 'menuTrigger' | 'onSubmit' | 'selectedKey'
	> {
	value: string;
	onValueChange: (value: string) => void;
	onSubmit?: (searchTerm: string) => void;
	onClear?: () => void;
	onLocationSelect?: (location: SearchLocation) => void;
	placeholder?: string;
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
	longitude: number;
	latitude: number;
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
				longitude
				latitude
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
				level: item.level,
				longitude: item.longitude,
				latitude: item.latitude
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
	onValueChange,
	onSubmit,
	onClear,
	onLocationSelect,
	placeholder = 'Search for a location...',
	...props
}: LocationAutocompleteProps) {
	const [inputValue, setInputValue] = useState(value);
	const [debouncedValue] = useDebounce(inputValue, 250);
	const [suggestions, setSuggestions] = useState<SearchLocation[]>([]);
	const [selectedKey, setSelectedKey] = useState<Key | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const inputRef = useRef<HTMLInputElement>(null);
	const [queryReference, loadQuery, disposeQuery] = useQueryLoader<LocationAutocompleteQuery>(SearchLocationsQuery);

	// Sync inputValue with external value prop
	useEffect(() => {
		setInputValue(value);
	}, [value]);

	const handleDataLoaded = useCallback((locations: SearchLocation[]) => {
		setSuggestions(locations);
		// Make sure loading state is turned off when data is loaded
		setIsLoading(false);
	}, []);

	// Load suggestions when debounced value changes
	useEffect(() => {
		if (debouncedValue && debouncedValue.length >= 2) {
			setIsLoading(true);

			// Use startTransition to avoid UI jank during data fetching
			startTransition(() => {
				loadQuery(
					{ searchTerm: debouncedValue },
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
	}, [debouncedValue, loadQuery, disposeQuery]);
	const handleInputChange = (newInputValue: string) => {
		setInputValue(newInputValue);

		// Clear selection when user types
		if (selectedKey !== null) {
			setSelectedKey(null);
		}

		// Update parent component's value
		onValueChange(newInputValue);
	};
	const handleSelectionChange = (key: Key | null) => {
		setSelectedKey(key);

		if (!key) {
			return;
		}

		const selected = suggestions.find(item => item.placeId === key);
		if (selected) {
			// Update input value
			setInputValue(selected.address.displayName || '');

			// Update parent component's value
			onValueChange(selected.address.displayName || '');

			// Call the onLocationSelect callback
			onLocationSelect?.(selected);

			setIsLoading(false);
			disposeQuery();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();

			// If there's a selected key, use that value
			if (selectedKey) {
				const selectedLocation = suggestions.find(location => location.placeId === selectedKey);
				if (selectedLocation) {
					onSubmit?.(selectedLocation.address.displayName || '');
					setInputValue(selectedLocation.address.displayName || '');
				} else {
					onSubmit?.(inputValue);
					setInputValue(inputValue);
				}
			} else {
				// No selection, use the typed value
				onSubmit?.(inputValue);
				setInputValue(inputValue);
			}

			// Blur the input to remove focus
			inputRef.current?.blur();
		}
	};

	const handleClear = () => {
		setInputValue('');
		setSelectedKey(null);
		onValueChange('');
		onClear?.();
	};

	const handleBlur = () => {
		if (inputValue === '') {
			onClear?.();
		}
	};

	return (
		<>
			{queryReference && <LocationResultControls queryReference={queryReference} onDataLoaded={handleDataLoaded} />}
			<Autocomplete<SearchLocation>
				{...props}
				ref={inputRef}
				inputValue={inputValue}
				selectedKey={selectedKey ? selectedKey : null}
				onInputChange={handleInputChange}
				onSelectionChange={handleSelectionChange}
				onKeyDown={handleKeyDown}
				onClear={handleClear}
				onBlur={handleBlur}
				isLoading={isLoading || isPending}
				placeholder={placeholder}
				menuTrigger='input'
				isClearable
				items={suggestions}
				shouldCloseOnBlur={false}
				allowsEmptyCollection
				autoComplete='off' // Prevent browser autocomplete from interfering
				isVirtualized
				itemHeight={50}
				maxListboxHeight={250}
				aria-label='Location Search'
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
