"use client";

import type { JobSearchAutocompleteQuery } from "@/__generated__/JobSearchAutocompleteQuery.graphql";
import type { AutocompleteProps } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import type { Key } from "react";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";
import { useDebounce } from "use-debounce";

export type SearchJob = {
	displayName: string;
	jobId: string;
};

interface JobSearchAutocompleteProps
	extends Omit<
		AutocompleteProps,
		| "children"
		| "items"
		| "inputValue"
		| "onInputChange"
		| "onSelectionChange"
		| "isLoading"
		| "allowsCustomValue"
		| "menuTrigger"
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

	return null;
}

export default function JobSearchAutocomplete({
	value,
	onValueChange,
	onSubmit,
	onClear,
	onJobSelect,
	placeholder = "Search for healthcare jobs...",
	...props
}: JobSearchAutocompleteProps) {
	const [debouncedValue] = useDebounce(value, 300);
	const [suggestions, setSuggestions] = useState<SearchJob[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [queryReference, loadQuery, disposeQuery] =
		useQueryLoader<JobSearchAutocompleteQuery>(SearchJobsQuery);

	const handleDataLoaded = useCallback((jobs: SearchJob[]) => {
		setSuggestions(jobs);
		setIsLoading(false);
	}, []);

	// Load suggestions when debounced value changes and meets criteria
	useEffect(() => {
		if (debouncedValue && debouncedValue.length >= 2) {
			setIsLoading(true);
			startTransition(() => {
				loadQuery(
					{ searchTerm: debouncedValue },
					{
						fetchPolicy: "store-or-network",
						networkCacheConfig: { force: false },
					},
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

	const handleInputChange = (inputValue: string) => {
		onValueChange(inputValue);
	};

	const handleSelectionChange = (selectedKey: Key | null) => {
		if (!selectedKey) return;

		const selectedJob = suggestions.find((job) => job.jobId === selectedKey);
		if (selectedJob) {
			onValueChange(selectedJob.displayName);
			onJobSelect?.(selectedJob);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			onSubmit?.(value);
		}
	};

	const handleClear = () => {
		onValueChange("");
		onClear?.();
	};

	return (
		<>
			{queryReference && (
				<JobSuggestionsLoader
					queryReference={queryReference}
					onDataLoaded={handleDataLoaded}
				/>
			)}
			<Autocomplete
				{...props}
				inputValue={value}
				onInputChange={handleInputChange}
				onSelectionChange={handleSelectionChange}
				onKeyDown={handleKeyDown}
				onClear={handleClear}
				isLoading={isLoading || isPending}
				placeholder={placeholder}
				allowsCustomValue
				menuTrigger="input"
				isClearable
				items={suggestions}
			>
				{(job) => (
					<AutocompleteItem key={job.jobId} value={job.jobId}>
						{job.displayName}
					</AutocompleteItem>
				)}
			</Autocomplete>
		</>
	);
}
