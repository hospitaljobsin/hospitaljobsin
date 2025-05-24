import type { FragmentRefs, ReaderInlineDataFragment } from "relay-runtime";
export type pageJobDetailMetadataFragment$data = {
	readonly organization:
		| {
				readonly __typename: "Organization";
				readonly job:
					| {
							readonly __typename: "Job";
							readonly description: string | null | undefined;
							readonly title: string;
					  }
					| {
							// This will never be '%other', but we need some
							// value in case none of the concrete values match.
							readonly __typename: "%other";
					  };
				readonly logoUrl: string;
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

(node as any).hash = "e0ed440db7fec8b0a34a227f885e0aed";

export default node;
