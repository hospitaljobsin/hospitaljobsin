"use client";

import type { JobSearchAutocompleteQuery } from "@/__generated__/JobSearchAutocompleteQuery.graphql";
import type { AutocompleteProps } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import type { Key } from "react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";
import { useDebounce } from "use-debounce";

interface JobSearchAutocompleteProps
	extends Omit<
		AutocompleteProps,
		"children" | "onChange" | "isClearable" | "onClear"
	> {
	value: string;
	onChange: (value: SearchJob) => void;
	onValueChange: (value: string) => void;
	onSearchSubmit: (searchTerm: string) => void;
	onClear?: () => void;
}

export type SearchJob = {
	displayName: string;
	jobId: string;
};

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

// Separate component to handle data fetching using the query reference
function JobResultControls({
	queryReference,
	onDataLoaded,
}: {
	queryReference: PreloadedQuery<JobSearchAutocompleteQuery>;
	onDataLoaded: (jobs: SearchJob[]) => void;
}) {
	const data = usePreloadedQuery(SearchJobsQuery, queryReference);

	useEffect(() => {
		if (data?.autocompleteJobs?.jobs) {
			const mappedJobs = data.autocompleteJobs.jobs.map((item) => ({
				displayName: item.displayName,
				jobId: item.jobId,
			}));
			onDataLoaded(mappedJobs);
		} else {
			onDataLoaded([]);
		}
	}, [data, onDataLoaded]);

	// This component doesn't render anything visually
	return null;
}

export default function JobSearchAutocomplete({
	value,
	onChange,
	onClear,
	onValueChange,
	onSearchSubmit,
	...props
}: JobSearchAutocompleteProps) {
	const [debouncedSearchTerm] = useDebounce(value, 300);
	const [suggestions, setSuggestions] = useState<SearchJob[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [queryReference, loadQuery, disposeQuery] =
		useQueryLoader<JobSearchAutocompleteQuery>(SearchJobsQuery);

	const shouldRefetchSuggestions = useRef(true);

	const handleDataLoaded = useCallback((jobs: SearchJob[]) => {
		setSuggestions(jobs);
		// Make sure loading state is turned off when data is loaded
		setIsLoading(false);
	}, []);

	useEffect(() => {
		if (!shouldRefetchSuggestions.current) {
			shouldRefetchSuggestions.current = true;
			return;
		}
		// Only fetch suggestions if we have a valid query
		if (debouncedSearchTerm && debouncedSearchTerm.length >= 3) {
			setIsLoading(true);
			startTransition(() => {
				loadQuery(
					{ searchTerm: debouncedSearchTerm },
					{
						fetchPolicy: "store-or-network",
						networkCacheConfig: { force: false },
					},
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
	}, [debouncedSearchTerm, loadQuery, disposeQuery]);

	const handleSelectionChange = (selectedKey: Key | null) => {
		if (!selectedKey) {
			// Do nothing on blur or deselection
			return;
		}
		const selected = suggestions.find((item) => item.jobId === selectedKey);
		if (selected) {
			shouldRefetchSuggestions.current = false;
			// Update the input value to show the selected item
			onValueChange(selected.displayName);
			onChange(selected);
			// Trigger search refetch when user selects an item
			onSearchSubmit(selected.displayName);
			setIsLoading(false);
			// Clear query reference to completely stop the loading state
			disposeQuery();
		}
	};

	const handleInputChange = (value: string) => {
		onValueChange(value);
		// Don't call onChange here, only when selection changes
	};

	// Handle clear action to trigger empty search
	const handleClear = () => {
		onClear?.();
		// Trigger search refetch with empty term when cleared
		onSearchSubmit("");
	};

	const onBlur = () => {
		if (value === "") {
			onClear?.();
			onSearchSubmit("");
		}
	};

	return (
		<>
			{queryReference && (
				<JobResultControls
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
				isClearable
				onClear={handleClear}
				onBlur={onBlur}
			>
				{suggestions.map((suggestion) => (
					<AutocompleteItem key={suggestion.jobId}>
						{suggestion.displayName}
					</AutocompleteItem>
				))}
			</Autocomplete>
		</>
	);
}
