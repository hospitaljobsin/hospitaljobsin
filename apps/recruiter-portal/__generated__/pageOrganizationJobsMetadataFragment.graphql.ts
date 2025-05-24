import type { FragmentRefs, ReaderInlineDataFragment } from "relay-runtime";
export type pageOrganizationJobsMetadataFragment$data = {
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
	readonly " $fragmentType": "pageOrganizationJobsMetadataFragment";
};
export type pageOrganizationJobsMetadataFragment$key = {
	readonly " $data"?: pageOrganizationJobsMetadataFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"pageOrganizationJobsMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
	kind: "InlineDataFragment",
	name: "pageOrganizationJobsMetadataFragment",
};

(node as any).hash = "653de66cf99b7d84c47497bcfd033a90";

export default node;
