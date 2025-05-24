import type { FragmentRefs, ReaderInlineDataFragment } from "relay-runtime";
export type pageOrganizationInvitesMetadataFragment$data = {
	readonly organization:
		| {
				readonly __typename: "Organization";
				readonly description: string | null | undefined;
				readonly isAdmin: boolean;
				readonly logoUrl: string;
				readonly name: string;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "pageOrganizationInvitesMetadataFragment";
};
export type pageOrganizationInvitesMetadataFragment$key = {
	readonly " $data"?: pageOrganizationInvitesMetadataFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"pageOrganizationInvitesMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
	kind: "InlineDataFragment",
	name: "pageOrganizationInvitesMetadataFragment",
};

(node as any).hash = "6515421c851c44789b8d70b649b2941f";

export default node;
