import type { FragmentRefs, ReaderInlineDataFragment } from "relay-runtime";
export type pageJobDetailMetadataFragment$data = {
	readonly organization:
		| {
				readonly __typename: "Organization";
				readonly description: string | null | undefined;
				readonly isMember: boolean;
				readonly job:
					| {
							readonly __typename: "Job";
							readonly title: string;
					  }
					| {
							// This will never be '%other', but we need some
							// value in case none of the concrete values match.
							readonly __typename: "%other";
					  };
				readonly logoUrl: string;
				readonly name: string;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "pageJobDetailMetadataFragment";
};
export type pageJobDetailMetadataFragment$key = {
	readonly " $data"?: pageJobDetailMetadataFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"pageJobDetailMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
	kind: "InlineDataFragment",
	name: "pageJobDetailMetadataFragment",
};

(node as any).hash = "0de89ff0c1a16a11d5f7b44597aa183b";

export default node;
