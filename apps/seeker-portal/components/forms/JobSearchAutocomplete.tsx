'use client';

import type { JobSearchAutocompleteQuery } from '@/__generated__/JobSearchAutocompleteQuery.graphql';
import type { AutocompleteProps } from '@heroui/react';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import type { Key } from 'react';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import type { PreloadedQuery } from 'react-relay';
import { usePreloadedQuery, useQueryLoader } from 'react-relay';
import { graphql } from 'relay-runtime';
import { useDebounce } from 'use-debounce';

export type SearchJob = {
	displayName: string;
	jobId: string;
};

interface JobSearchAutocompleteProps
	extends Omit<
		AutocompleteProps<SearchJob>,
		| 'children'
		| 'items'
		| 'inputValue'
		| 'onInputChange'
		| 'onSelectionChange'
		| 'isLoading'
		| 'allowsCustomValue'
		| 'menuTrigger'
		| 'onSubmit'
	> {
	value: string;
	onValueChange: (value: string) => void;
	onSubmit?: (searchTerm: string) => void;
	onClear?: () => void;
	onJobSelect?: (job: SearchJob) => void;
	placeholder?: string;
}

const SearchJobsQuery = graphql`
	query JobSearchAutocompleteQuery($searchTerm: String!) {
		autocompleteJobs(searchTerm: $searchTerm) {
			jobs {
				__typename
				displayName
				jobId
			}
		}
	}
`;

function JobSuggestionsLoader({
	queryReference,
	onDataLoaded
}: {
	queryReference: PreloadedQuery<JobSearchAutocompleteQuery>;
	onDataLoaded: (jobs: SearchJob[]) => void;
}) {
	const data = usePreloadedQuery(SearchJobsQuery, queryReference);

	useEffect(() => {
		if (data?.autocompleteJobs?.jobs) {
			const mappedJobs = data.autocompleteJobs.jobs.map(item => ({
				displayName: item.displayName,
				jobId: item.jobId
			}));
			onDataLoaded(mappedJobs);
		} else {
			onDataLoaded([]);
		}
	}, [data, onDataLoaded]);

	return null;
}

export default function JobSearchAutocomplete({
	value,
	onValueChange,
	onSubmit,
	onClear,
	onJobSelect,
	placeholder = 'Search for healthcare jobs...',
	...props
}: JobSearchAutocompleteProps) {
	const [debouncedValue] = useDebounce(value, 250);
	const [suggestions, setSuggestions] = useState<SearchJob[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [justSubmitted, setJustSubmitted] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [queryReference, loadQuery, disposeQuery] = useQueryLoader<JobSearchAutocompleteQuery>(SearchJobsQuery);

	// Track the last selected value to prevent it from being cleared
	const lastSelectedValue = useRef<string | null>(null);
	const lastSelectedValueTimestamp = useRef<number>(0);
	const shouldRefetchSuggestions = useRef(true);

	const handleDataLoaded = useCallback((jobs: SearchJob[]) => {
		setSuggestions(jobs);
		setIsLoading(false);
	}, []);

	// Load suggestions when debounced value changes and meets criteria
	useEffect(() => {
		if (!shouldRefetchSuggestions.current) {
			shouldRefetchSuggestions.current = true;
			return;
		}

		if (debouncedValue && debouncedValue.length >= 2 && !justSubmitted) {
			setIsLoading(true);
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
			setSuggestions([]);
			setIsLoading(false);
			disposeQuery();
		}

		return () => {
			disposeQuery();
		};
	}, [debouncedValue, loadQuery, disposeQuery, justSubmitted]);

	const handleInputChange = (inputValue: string) => {
		console.log('INPUT CHANGE: ', inputValue);

		// Reset justSubmitted when user starts typing again
		if (justSubmitted) {
			setJustSubmitted(false);
		}

		// If we have a last selected value and the input is being cleared (likely due to a race condition),
		// don't clear it and maintain the selected value
		if (inputValue === '' && lastSelectedValue.current && !justSubmitted) {
			// If the value is being cleared right after a selection, it might be a race condition
			// Check if less than 100ms passed since selection (typical for UI framework events)
			const timeSinceLastUpdate = Date.now() - (lastSelectedValueTimestamp.current || 0);
			if (timeSinceLastUpdate < 100) {
				console.log('Preventing value clear, restoring:', lastSelectedValue.current);
				setTimeout(() => {
					// Make sure value is not null before using it
					const valueToRestore = lastSelectedValue.current;
					if (valueToRestore) {
						onValueChange(valueToRestore);
					}
				}, 0);
				return;
			}

			// If it's been longer, user probably intentionally cleared the input
			lastSelectedValue.current = null;
			setSuggestions([]);
		} else if (inputValue === '') {
			// Normal clearing behavior
			setSuggestions([]);
		}

		// Update the input value
		onValueChange(inputValue);
	};

	const handleSelectionChange = (selectedKey: Key | null) => {
		if (!selectedKey) {
			// Do nothing on blur or deselection
			return;
		}

		const selectedJob = suggestions.find(job => job.jobId === selectedKey);
		if (selectedJob) {
			console.log('Selection changed to:', selectedJob);

			// Prevent refetching suggestions when setting value from selection
			shouldRefetchSuggestions.current = false;

			// Store the selected value to prevent it from being cleared
			lastSelectedValue.current = selectedJob.displayName;
			lastSelectedValueTimestamp.current = Date.now();

			// Update the input value with the display name
			onValueChange(selectedJob.displayName);

			// Call the onJobSelect callback with the selected job
			onJobSelect?.(selectedJob);

			// Submit the selected value if onSubmit is provided
			onSubmit?.(selectedJob.displayName);

			setIsLoading(false);
			// Clear query reference to completely stop the loading state
			disposeQuery();
		}
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

	const handleClear = () => {
		onValueChange('');
		onClear?.();
	};

	const handleBlur = () => {
		if (value === '') {
			onClear?.();
		}
	};

	return (
		<>
			{queryReference && <JobSuggestionsLoader queryReference={queryReference} onDataLoaded={handleDataLoaded} />}
			<Autocomplete<SearchJob>
				{...props}
				ref={inputRef}
				inputValue={value}
				onInputChange={handleInputChange}
				onSelectionChange={handleSelectionChange}
				onKeyDown={handleKeyDown}
				onClear={handleClear}
				onBlur={handleBlur}
				isLoading={isLoading || isPending}
				placeholder={placeholder}
				allowsCustomValue
				menuTrigger='input'
				isClearable
				items={suggestions}
				shouldCloseOnBlur={false}
				allowsEmptyCollection
				autoComplete='off'
				isVirtualized
				itemHeight={50}
				aria-label='Job Search'
			>
				{(job: SearchJob) => <AutocompleteItem key={job.jobId}>{job.displayName}</AutocompleteItem>}
			</Autocomplete>
		</>
	);
}
