import { useEffect, useRef } from "react";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Session from "./Session";
import SessionsListSkeleton from "./SessionsListSkeleton";
import type { SessionsListFragment$key } from "./__generated__/SessionsListFragment.graphql";
import type { SessionsSettingsViewQuery } from "./__generated__/SessionsSettingsViewQuery.graphql";

const SessionsListFragment = graphql`
  fragment SessionsListFragment on Account
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "SessionsListPaginationQuery") {
    sessions(after: $cursor, first: $count)
      @connection(key: "SessionsListFragment_sessions") {
      edges {
        node {
          id
          ...SessionFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	root: SessionsListFragment$key;
};

export default function SessionsList({ root }: Props) {
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		SessionsSettingsViewQuery,
		SessionsListFragment$key
	>(SessionsListFragment, root);

	const observerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (
					entry.isIntersecting &&
					data.sessions.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(5);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.sessions.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	if (data.sessions.edges.length === 0 && !data.sessions.pageInfo.hasNextPage) {
		return null;
	}

	return (
		<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
			{data.sessions.edges.map((sessionEdge) => (
				<Session session={sessionEdge.node} key={sessionEdge.node.id} />
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <SessionsListSkeleton />}
		</div>
	);
}
