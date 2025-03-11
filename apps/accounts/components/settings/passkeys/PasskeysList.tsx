import { KeySquareIcon } from "lucide-react";
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
	...PasskeyAccountMetadataFragment
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
    webAuthnCredentials(after: $cursor, first: $count)
      @connection(key: "PasskeysListInternalFragment_webAuthnCredentials") {
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
					data.webAuthnCredentials.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(5);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.webAuthnCredentials.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	return (
		<div className="w-full flex flex-col gap-6">
			<div className="flex w-full items-center justify-between gap-6">
				<p className="text-foreground-600">Your Passkeys</p>
				<PasskeysController
					passkeysConnectionId={data.webAuthnCredentials.__id}
					account={rootQuery}
				/>
			</div>
			<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
				{data.webAuthnCredentials.edges.length < 1 ? (
					<div className="w-full flex flex-col items-center justify-center gap-8 py-12 border-dashed border-foreground-300 border-2 rounded-lg">
						<div className="p-4 rounded-full bg-primary/10">
							<KeySquareIcon className="w-8 h-8 text-primary" />
						</div>
						<div className="flex flex-col items-center gap-1.5">
							<h3 className="font-medium text-lg">No passkeys added</h3>
							<p className="text-foreground-600 text-center">
								Add a passkey to sign in without a password
							</p>
						</div>
						<PasskeysController
							passkeysConnectionId={data.webAuthnCredentials.__id}
							account={rootQuery}
						/>
					</div>
				) : (
					<>
						{data.webAuthnCredentials.edges.map((passkeyEdge) => (
							<Passkey
								passkey={passkeyEdge.node}
								key={passkeyEdge.node.id}
								passkeysConnectionId={data.webAuthnCredentials.__id}
								account={rootQuery}
								totalPasskeys={data.webAuthnCredentials.edges.length}
							/>
						))}
					</>
				)}

				<div ref={observerRef} className="h-10" />
				{isLoadingNext && <PasskeysListSkeleton />}
			</div>
		</div>
	);
}
