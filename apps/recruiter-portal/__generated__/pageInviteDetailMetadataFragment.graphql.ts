import type { FragmentRefs, ReaderInlineDataFragment } from "relay-runtime";
export type pageInviteDetailMetadataFragment$data = {
	readonly organizationInvite:
		| {
				readonly __typename: "OrganizationInvite";
				readonly createdBy: {
					readonly fullName: string;
				};
				readonly email: string;
				readonly organization: {
					readonly isMember: boolean;
					readonly logoUrl: string;
					readonly name: string;
					readonly slug: string;
				};
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "pageInviteDetailMetadataFragment";
};
export type pageInviteDetailMetadataFragment$key = {
	readonly " $data"?: pageInviteDetailMetadataFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"pageInviteDetailMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
	kind: "InlineDataFragment",
	name: "pageInviteDetailMetadataFragment",
};

(node as any).hash = "d8d396ee5f59d5fab15040acdbbce7cc";

export default node;
