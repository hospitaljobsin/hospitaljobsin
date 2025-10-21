'use client';
import { useEffect, useRef, useTransition } from 'react';
import { usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { OrganizationsGridFragment$key } from '@/__generated__/OrganizationsGridFragment.graphql';
import type { OrganizationsGridPaginationQuery } from '@/__generated__/OrganizationsGridPaginationQuery.graphql';
import OrganizationCard from './OrganizationCard';
import OrganizationsGridSkeleton from './OrganizationsGridSkeleton';

const OrganizationsGridFragment = graphql`
	fragment OrganizationsGridFragment on Query
	@refetchable(queryName: "OrganizationsGridPaginationQuery")
	@argumentDefinitions(first: { type: "Int", defaultValue: 50 }, after: { type: "ID" }, searchTerm: { type: "String" }) {
		organizations(first: $first, after: $after, searchTerm: $searchTerm) @connection(key: "OrganizationsGridFragment_organizations", filters: ["searchTerm"]) {
			edges {
				node {
					id
					...OrganizationCardFragment
				}
			}
		}
	}
`;

interface OrganizationsGridProps {
	query: OrganizationsGridFragment$key;
	searchTerm: string;
}

export default function OrganizationsGrid({ query, searchTerm }: OrganizationsGridProps) {
	const [_isPending, startTransition] = useTransition();
	const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
		OrganizationsGridPaginationQuery,
		OrganizationsGridFragment$key
	>(OrganizationsGridFragment, query);

	const hasMountedRef = useRef(false);

	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!hasNext || isLoadingNext) return;

		observerRef.current = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					loadNext(50);
				}
			},
			{ threshold: 0.1 }
		);

		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current);
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [hasNext, isLoadingNext, loadNext]);

	useEffect(() => {
		if (!hasMountedRef.current) {
			hasMountedRef.current = true;
			return;
		}
		const debounceTimeout = setTimeout(() => {
			startTransition(() => {
				refetch({ searchTerm: searchTerm || null }, { fetchPolicy: 'network-only' });
			});
		}, 300);
		return () => clearTimeout(debounceTimeout);
	}, [refetch, searchTerm]);

	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{data.organizations.edges.map(({ node }) => (
					<OrganizationCard key={node.id} organization={node} />
				))}
			</div>

			{hasNext && (
				<div ref={loadMoreRef} className='py-8 w-full'>
					{isLoadingNext && <OrganizationsGridSkeleton />}
				</div>
			)}
		</>
	);
}
