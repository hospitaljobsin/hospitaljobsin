import type { FragmentRefs, ReaderInlineDataFragment } from "relay-runtime";
export type pageOrganizationDetailMetadataFragment$data = {
	readonly organization:
		| {
				readonly __typename: "Organization";
				readonly description: string | null | undefined;
				readonly isMember: boolean;
				readonly logoUrl: string;
				readonly name: string;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "pageOrganizationDetailMetadataFragment";
};
export type pageOrganizationDetailMetadataFragment$key = {
	readonly " $data"?: pageOrganizationDetailMetadataFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"pageOrganizationDetailMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
	kind: "InlineDataFragment",
	name: "pageOrganizationDetailMetadataFragment",
};

(node as any).hash = "19c6662d1e70a775b5242c91d094d6eb";

export default node;
