import { useEffect, useMemo, useRef } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Session from "./Session";
import SessionsController from "./SessionsController";
import SessionsListSkeleton from "./SessionsListSkeleton";
import type { SessionsListCurrentSessionFragment$key } from "./__generated__/SessionsListCurrentSessionFragment.graphql";
import type { SessionsListFragment$key } from "./__generated__/SessionsListFragment.graphql";
import type { SessionsListInternalFragment$key } from "./__generated__/SessionsListInternalFragment.graphql";
import type { SessionsSettingsViewQuery } from "./__generated__/SessionsSettingsViewQuery.graphql";

const SessionsListFragment = graphql`
  fragment SessionsListFragment on Account{
	...SessionsControllerFragment
    ...SessionsListInternalFragment
	...SessionsListCurrentSessionFragment
	...SessionAccountSudoFragment
  }
`;

const SessionsListCurrentSessionFragment = graphql`
fragment SessionsListCurrentSessionFragment on Account {
	  currentSession { 
		...SessionFragment
	  }
}`;

const SessionsListInternalFragment = graphql`
  fragment SessionsListInternalFragment on Account
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "SessionsListPaginationQuery") {
    sessions(after: $cursor, first: $count)
      @connection(key: "SessionsListInternalFragment_sessions") {
		__id
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
	const rootQuery = useFragment(SessionsListFragment, root);
	const currentSession = useFragment<SessionsListCurrentSessionFragment$key>(
		SessionsListCurrentSessionFragment,
		rootQuery,
	);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		SessionsSettingsViewQuery,
		SessionsListInternalFragment$key
	>(SessionsListInternalFragment, rootQuery);

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

	const canDeleteAllSessions = useMemo(
		() => data.sessions.edges.length > 1,
		[data.sessions.edges],
	);

	return (
		<div className="w-full flex flex-col gap-6">
			<div className="flex w-full items-center justify-between gap-6">
				<p className="text-foreground-600">My Sessions</p>
				<SessionsController
					sessionsConnectionId={data.sessions.__id}
					isDisabled={!canDeleteAllSessions}
					account={rootQuery}
				/>
			</div>
			<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
				<Session
					session={currentSession.currentSession}
					sessionsConnectionId={data.sessions.__id}
					account={rootQuery}
					isCurrentSession
				/>
				{data.sessions.edges.map((sessionEdge) => (
					<Session
						session={sessionEdge.node}
						key={sessionEdge.node.id}
						sessionsConnectionId={data.sessions.__id}
						account={rootQuery}
						isCurrentSession={false}
					/>
				))}
				<div ref={observerRef} className="h-10" />
				{isLoadingNext && <SessionsListSkeleton />}
			</div>
		</div>
	);
}
