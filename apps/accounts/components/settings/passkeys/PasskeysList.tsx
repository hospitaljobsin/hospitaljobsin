import { useEffect, useRef } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Passkey from "./Passkey";
import PasskeysController from "./PasskeysController";
import PasskeysListSkeleton from "./PasskeysListSkeleton";
import type { PasskeysListFragment$key } from "./__generated__/PasskeysListFragment.graphql";
import type { PasskeysListInternalFragment$key } from "./__generated__/PasskeysListInternalFragment.graphql";
import type { PasskeysSettingsViewQuery } from "./__generated__/PasskeysSettingsViewQuery.graphql";

const PasskeysListFragment = graphql`
  fragment PasskeysListFragment on Account{
	...PasskeyAccountSudoFragment
    ...PasskeysListInternalFragment
	...PasskeysControllerFragment
  }
`;

const PasskeysListInternalFragment = graphql`
  fragment PasskeysListInternalFragment on Account
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "PasskeysListPaginationQuery") {
    webauthnCredentials(after: $cursor, first: $count)
      @connection(key: "PasskeysListInternalFragment_webauthnCredentials") {
        __id
      edges {
        node {
          id
          ...PasskeyFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	root: PasskeysListFragment$key;
};

export default function PasskeysList({ root }: Props) {
	const rootQuery = useFragment(PasskeysListFragment, root);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		PasskeysSettingsViewQuery,
		PasskeysListInternalFragment$key
	>(PasskeysListInternalFragment, rootQuery);

	const observerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (
					entry.isIntersecting &&
					data.webauthnCredentials.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(5);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.webauthnCredentials.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	return (
		<div className="w-full flex flex-col gap-6">
			<div className="flex w-full items-center justify-between gap-6">
				<p className="text-foreground-600">My Passkeys</p>
				<PasskeysController
					passkeysConnectionId={data.webauthnCredentials.__id}
					account={rootQuery}
				/>
			</div>
			<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
				{data.webauthnCredentials.edges.map((passkeyEdge) => (
					<Passkey
						passkey={passkeyEdge.node}
						key={passkeyEdge.node.id}
						passkeysConnectionId={data.webauthnCredentials.__id}
						account={rootQuery}
					/>
				))}
				<div ref={observerRef} className="h-10" />
				{isLoadingNext && <PasskeysListSkeleton />}
			</div>
		</div>
	);
}
