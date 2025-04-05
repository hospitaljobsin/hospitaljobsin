/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { InviteDetailViewFragment$key } from "@/__generated__/InviteDetailViewFragment.graphql";
import { graphql, useFragment } from "react-relay";
import InviteForm from "./InviteForm";

const InviteDetailViewFragment = graphql`
 fragment InviteDetailViewFragment on Query @argumentDefinitions(
      inviteToken: {
        type: "String!",
      }
    ) {
        ...InviteFormFragment @arguments(inviteToken: $inviteToken)
  }
`;

export default function InviteDetailView(props: {
	rootQuery: InviteDetailViewFragment$key;
}) {
	const query = useFragment(InviteDetailViewFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<InviteForm rootQuery={query} />
		</div>
	);
}
