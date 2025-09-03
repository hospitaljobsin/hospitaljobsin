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
	extends Omit<AutocompleteProps, "children" | "onChange"> {
	value: string;
	onChange: (value: string) => void;
	onValueChange: (value: string) => void;
	onClear?: () => void;
}

export type JobSuggestion = {
	title: string;
};

const SearchJobsAutocompleteQuery = graphql`
	query JobSearchAutocompleteQuery($searchTerm: String!) {
		jobSearchAutocompleteSuggestions(searchTerm: $searchTerm) {
			suggestions {
				__typename
				title
			}
		}
	}
`;

// Separate component to handle data fetching using the query reference
function JobSearchResultControls({
	queryReference,
	onDataLoaded,
}: {
	queryReference: PreloadedQuery<JobSearchAutocompleteQuery>;
	onDataLoaded: (suggestions: JobSuggestion[]) => void;
}) {
	const data = usePreloadedQuery(SearchJobsAutocompleteQuery, queryReference);

	useEffect(() => {
		if (data?.jobSearchAutocompleteSuggestions?.suggestions) {
			const mappedSuggestions = data.jobSearchAutocompleteSuggestions.suggestions.map((item) => ({
				title: item.title,
			}));
			onDataLoaded(mappedSuggestions);
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
	...props
}: JobSearchAutocompleteProps) {
	const [debouncedSearchTerm] = useDebounce(value, 300);
	const [suggestions, setSuggestions] = useState<JobSuggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [queryReference, loadQuery, disposeQuery] =
		useQueryLoader<JobSearchAutocompleteQuery>(SearchJobsAutocompleteQuery);

	const shouldRefetchSuggestions = useRef(true);

	const handleDataLoaded = useCallback((loadedSuggestions: JobSuggestion[]) => {
		setSuggestions(loadedSuggestions);
		// Make sure loading state is turned off when data is loaded
		setIsLoading(false);
	}, []);

	useEffect(() => {
		if (!shouldRefetchSuggestions.current) {
			shouldRefetchSuggestions.current = true;
			return;
		}
		// Only fetch suggestions if we have a valid query
		if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
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
		const selected = suggestions.find((item) => item.title === selectedKey);
		if (selected) {
			shouldRefetchSuggestions.current = false;
			onChange(selected.title);
			setIsLoading(false);
			// Clear query reference to completely stop the loading state
			disposeQuery();
		}
	};

	const handleInputChange = (inputValue: string) => {
		onValueChange(inputValue);
		// Don't call onChange here, only when selection changes
	};

	// Prevent form submission that could cause page refresh
	const preventFormSubmission = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
		}
	};

	return (
		<>
			{queryReference && (
				<JobSearchResultControls
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
				onKeyDown={preventFormSubmission}
				isClearable
				onClear={onClear}
			>
				{suggestions.map((suggestion) => (
					<AutocompleteItem key={suggestion.title}>
						{suggestion.title}
					</AutocompleteItem>
				))}
			</Autocomplete>
		</>
	);
}