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

	// Track the last selected value to prevent it from being cleared
	const lastSelectedValue = useRef<string | null>(null);
	const lastSelectedValueTimestamp = useRef<number>(0);
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
			// Do nothing on blur or deselection
			return;
		}
		const selected = suggestions.find(item => item.placeId === selectedKey);
		if (selected) {
			console.log('Selection changed to:', selected);

			// Prevent refetching suggestions when setting value from selection
			shouldRefetchSuggestions.current = false;

			// Update the parent component with the selected location object
			onChange?.({
				address: selected.address,
				placeId: selected.placeId,
				level: selected.level
			});

			// Set the input value to the displayName if it exists
			if (selected.address.displayName) {
				// Store the selected value to prevent it from being cleared
				lastSelectedValue.current = selected.address.displayName;
				lastSelectedValueTimestamp.current = Date.now();

				// Update the input value
				onValueChange?.(selected.address.displayName);

				// Submit the selected value
				onSubmit?.(selected.address.displayName);
			}

			setIsLoading(false);
			// Clear query reference to completely stop the loading state
			disposeQuery();
		}
	};

	const handleInputChange = (value: string) => {
		console.log('INPUT CHANGE: ', value);

		// Reset justSubmitted when user starts typing again
		if (justSubmitted) {
			setJustSubmitted(false);
		}

		// If we have a last selected value and the input is being cleared (likely due to a race condition),
		// don't clear it and maintain the selected value
		if (value === '' && lastSelectedValue.current && !justSubmitted) {
			// If the value is being cleared right after a selection, it might be a race condition
			// Check if less than 100ms passed since selection (typical for UI framework events)
			const timeSinceLastUpdate = Date.now() - (lastSelectedValueTimestamp.current || 0);
			if (timeSinceLastUpdate < 100) {
				console.log('Preventing value clear, restoring:', lastSelectedValue.current);
				setTimeout(() => {
					// Make sure value is not null before using it
					const valueToRestore = lastSelectedValue.current;
					if (valueToRestore) {
						onValueChange?.(valueToRestore);
					}
				}, 0);
				return;
			}

			// If it's been longer, user probably intentionally cleared the input
			lastSelectedValue.current = null;
			setSuggestions([]);
		} else if (value === '') {
			// Normal clearing behavior
			setSuggestions([]);
		}

		// Only update the value if it's not undefined or null
		if (value !== undefined && value !== null) {
			onValueChange?.(value);
		}

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
