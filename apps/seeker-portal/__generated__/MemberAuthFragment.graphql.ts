import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type MemberAuthFragment$data = {
	readonly __typename: string;
	readonly " $fragmentType": "MemberAuthFragment";
};
export type MemberAuthFragment$key = {
	readonly " $data"?: MemberAuthFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"MemberAuthFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "MemberAuthFragment",
	selections: [
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
	],
	type: "ViewerPayload",
	abstractKey: "__isViewerPayload",
};

(node as any).hash = "0bc47e20b4b303a23914c6b3647d6d42";

export default node;
