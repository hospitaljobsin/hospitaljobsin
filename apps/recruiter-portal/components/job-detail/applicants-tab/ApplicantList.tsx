import { usePaginationFragment } from "react-relay";
import Applicant from "./Applicant";

import type { ApplicantListFragment$key } from "@/__generated__/ApplicantListFragment.graphql";
import type { JobApplicantStatus } from "@/__generated__/ApplicantListPaginationQuery.graphql";
import type { pageJobApplicantsViewQuery } from "@/__generated__/pageJobApplicantsViewQuery.graphql";
import { UserRound } from "lucide-react";
import { startTransition, useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import ApplicantListSkeleton from "./ApplicantListSkeleton";

const ApplicantListFragment = graphql`
  fragment ApplicantListFragment on Job
  @argumentDefinitions(
	cursor: { type: "ID" }
	count: { type: "Int", defaultValue: 10 }
	searchTerm: { type: "String", defaultValue: null }
	status: { type: "JobApplicantStatus", defaultValue: null }
	showStatus: { type: "Boolean", defaultValue: true }
  )
  @refetchable(queryName: "ApplicantListPaginationQuery") {
	applicants(after: $cursor, first: $count, searchTerm: $searchTerm, status: $status)
	  @connection(key: "ApplicantListFragment_applicants", filters: ["status", "searchTerm"]) {
	  edges {
		node {
		  id
		  ...ApplicantFragment @arguments(showStatus: $showStatus)
		}
	  }
	  pageInfo {
		hasNextPage
	  }
	}
  }
`;

type Props = {
	rootQuery: ApplicantListFragment$key;
	searchTerm: string | null;
	status: JobApplicantStatus | null;
};

export default function ApplicantList({
	rootQuery,
	searchTerm,
	status,
}: Props) {
	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		pageJobApplicantsViewQuery,
		ApplicantListFragment$key
	>(ApplicantListFragment, rootQuery);

	const observerRef = useRef<HTMLDivElement | null>(null);

	const hasMountedRef = useRef(false);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (
					entry.isIntersecting &&
					data.applicants.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(25);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.applicants.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	// Debounced search term refetch
	useEffect(() => {
		if (!hasMountedRef.current) {
			// don't refetch on first render
			hasMountedRef.current = true;
			return;
		}
		const debounceTimeout = setTimeout(() => {
			startTransition(() => {
				refetch(
					{
						searchTerm: searchTerm,
						status: status,
						showStatus: status === null,
					},
					{ fetchPolicy: "store-or-network" },
				);
			});
		}, 300); // Adjust debounce delay as needed

		return () => clearTimeout(debounceTimeout);
	}, [refetch, searchTerm, status]);

	if (
		data.applicants.edges.length === 0 &&
		!data.applicants.pageInfo.hasNextPage
	) {
		return (
			<div className="w-full flex flex-col items-center justify-center gap-8 py-12 px-6 border-dashed border-foreground-300 border-2 rounded-lg">
				<div className="p-4 rounded-full bg-primary/10">
					<UserRound className="w-8 h-8 text-primary" />
				</div>
				<div className="flex flex-col items-center gap-4">
					<h3 className="font-medium text-lg">No applicants found</h3>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{data.applicants.edges.map((jobEdge) => (
				<Applicant applicant={jobEdge.node} key={jobEdge.node.id} />
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <ApplicantListSkeleton />}
		</div>
	);
}
