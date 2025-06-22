"use client";

import { usePaginationFragment } from "react-relay";

import type { ApplicantListFragment$key } from "@/__generated__/ApplicantListFragment.graphql";
import type { JobApplicantStatus } from "@/__generated__/ApplicantListPaginationQuery.graphql";
import type { pageJobDetailApplicantsQuery } from "@/__generated__/pageJobDetailApplicantsQuery.graphql";
import links from "@/lib/links";
import {
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	User,
} from "@heroui/react";
import type { Selection } from "@react-types/shared";
import { UserRound } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useEffect, useRef } from "react";
import { graphql } from "react-relay";
import ApplicantCard from "./ApplicantCard";
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
		id
		applicants(
			after: $cursor
			first: $count
			searchTerm: $searchTerm
			status: $status
		) @connection(key: "ApplicantListFragment_applicants", filters: ["status", "searchTerm"]) {
			edges {
				node {
					id
					account @required(action: THROW) {
						email
						fullName
						avatarUrl
					}
					slug
					status @include(if: $showStatus)
					aiInsight {
						matchType
						score
						summary
						matchReasons
						mismatchedFields
					}
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
	selectedKeys: Selection;
	setSelectedKeys: (keys: Selection) => void;
	allKeys: Set<string>;
	isAllSelected: boolean;
};

export default function ApplicantList({
	rootQuery,
	searchTerm,
	status,
	selectedKeys,
	setSelectedKeys,
	allKeys,
	isAllSelected,
}: Props) {
	const router = useRouter();
	const params = useParams<{ slug: string }>();
	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		pageJobDetailApplicantsQuery,
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

	if (searchTerm) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
				{data.applicants.edges.map((edge) => (
					<button
						type="button"
						key={edge.node.id}
						className="cursor-pointer text-left"
						onClick={() => {
							router.push(
								links.applicantDetail(
									params.slug,
									encodeURIComponent(edge.node.slug),
								),
							);
						}}
					>
						<ApplicantCard applicant={edge.node} />
					</button>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<Table
				aria-label="Applicants table"
				shadow="none"
				hideHeader
				selectionMode="multiple"
				fullWidth
				selectedKeys={selectedKeys}
				onSelectionChange={setSelectedKeys}
				onRowAction={(key) => {
					const applicant = data.applicants.edges.find(
						(edge) => edge.node.id === key,
					)?.node;
					if (applicant) {
						router.push(
							links.applicantDetail(
								params.slug,
								encodeURIComponent(applicant.slug),
							),
						);
					}
				}}
			>
				<TableHeader className="w-full">
					<TableColumn>Applicant</TableColumn>
					<TableColumn>Status</TableColumn>
				</TableHeader>
				<TableBody
					className="w-full"
					items={data.applicants.edges.map((edge) => edge.node)}
					isLoading={isLoadingNext}
					loadingContent={<ApplicantListSkeleton />}
				>
					{(applicant) => (
						<TableRow key={applicant.id} className="cursor-pointer w-full">
							<TableCell>
								<User
									avatarProps={{ src: applicant.account.avatarUrl }}
									name={applicant.account.fullName}
									description={applicant.account.email}
								/>
							</TableCell>
							<TableCell>
								{applicant.status && <Chip>{applicant.status}</Chip>}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div ref={observerRef} />
			{isLoadingNext && <ApplicantListSkeleton />}
		</div>
	);
}
