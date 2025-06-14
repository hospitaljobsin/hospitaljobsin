"use client";
import type { ApplicationFormTabFragment$key } from "@/__generated__/ApplicationFormTabFragment.graphql";
import PageJobApplicationFormSettingsQuery, {
	type pageJobApplicationFormSettingsQuery,
} from "@/__generated__/pageJobApplicationFormSettingsQuery.graphql";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import ApplicationFormBuilder from "./ApplicationFormBuilder";

const ApplicationFormTabFragment = graphql`
 fragment ApplicationFormTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  jobSlug: {type: "String!"}
    ) {
        ...ApplicationFormBuilderFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

export default function ApplicationFormTab(props: {
	initialQueryRef: PreloadedQuery<pageJobApplicationFormSettingsQuery>;
}) {
	const data = usePreloadedQuery(
		PageJobApplicationFormSettingsQuery,
		props.initialQueryRef,
	);
	const query = useFragment<ApplicationFormTabFragment$key>(
		ApplicationFormTabFragment,
		data,
	);

	return (
		<div className="w-full h-full flex flex-col items-center gap-12">
			<ApplicationFormBuilder rootQuery={query} />
		</div>
	);
}
