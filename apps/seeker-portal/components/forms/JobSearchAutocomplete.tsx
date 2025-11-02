'use client';

import type { AutocompleteProps } from '@heroui/react';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import type { Key } from 'react';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import type { PreloadedQuery } from 'react-relay';
import { usePreloadedQuery, useQueryLoader } from 'react-relay';
import { graphql } from 'relay-runtime';
import { useDebounce } from 'use-debounce';
import type { JobSearchAutocompleteQuery } from '@/__generated__/JobSearchAutocompleteQuery.graphql';

export type SearchJob = {
	displayName: string;
	jobId: string;
};

interface JobSearchAutocompleteProps
	extends Omit<
		AutocompleteProps<SearchJob>,
		'children' | 'items' | 'inputValue' | 'onInputChange' | 'onSelectionChange' | 'isLoading' | 'menuTrigger' | 'onSubmit' | 'selectedKey'
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
	const [inputValue, setInputValue] = useState(value);
	const [debouncedValue] = useDebounce(inputValue, 250);
	const [suggestions, setSuggestions] = useState<SearchJob[]>([]);
	const [selectedKey, setSelectedKey] = useState<Key | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const inputRef = useRef<HTMLInputElement>(null);
	const [queryReference, loadQuery, disposeQuery] = useQueryLoader<JobSearchAutocompleteQuery>(SearchJobsQuery);

	// Sync inputValue with external value prop
	useEffect(() => {
		setInputValue(value);
	}, [value]);

	const handleDataLoaded = useCallback((jobs: SearchJob[]) => {
		setSuggestions(jobs);
		setIsLoading(false);
	}, []);

	// Load suggestions when debounced value changes
	useEffect(() => {
		if (debouncedValue && debouncedValue.length >= 2) {
			setIsLoading(true);
			startTransition(() => {
				loadQuery(
					{ searchTerm: debouncedValue },
					{
						fetchPolicy: 'network-only',
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
	}, [debouncedValue, loadQuery, disposeQuery]);

	const handleInputChange = (newInputValue: string) => {
		console.log('INPUT CHANGE: ', newInputValue);
		setInputValue(newInputValue);

		// Clear selection when user types
		if (selectedKey !== null) {
			setSelectedKey(null);
		}

		// Update parent component's value
		onValueChange(newInputValue);
	};

	const handleSelectionChange = (key: Key | null) => {
		console.log('SELECTION CHANGE: ', key);
		setSelectedKey(key);

		if (!key) {
			return;
		}

		const selectedJob = suggestions.find(job => job.jobId === key);
		if (selectedJob) {
			console.log('Selected job:', selectedJob);

			// Update input value
			setInputValue(selectedJob.displayName);

			// Update parent component's value
			onValueChange(selectedJob.displayName);

			// Call the onJobSelect callback
			onJobSelect?.(selectedJob);

			setIsLoading(false);
			disposeQuery();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();

			// If there's a selected key, use that value
			if (selectedKey) {
				const selectedJob = suggestions.find(job => job.jobId === selectedKey);
				if (selectedJob) {
					onSubmit?.(selectedJob.displayName);
					setInputValue(selectedJob.displayName);
				} else {
					onSubmit?.(inputValue);
					setInputValue(inputValue);
				}
			} else {
				// No selection, use the typed value
				onSubmit?.(inputValue);
				setInputValue(inputValue);
			}

			// Blur the input to remove focus and close menu
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
			{queryReference && <JobSuggestionsLoader queryReference={queryReference} onDataLoaded={handleDataLoaded} />}
			<Autocomplete<SearchJob>
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
