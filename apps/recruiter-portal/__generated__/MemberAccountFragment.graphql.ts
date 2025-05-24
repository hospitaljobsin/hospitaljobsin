import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type MemberAccountFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"MemberControlsAccountFragment">;
	readonly " $fragmentType": "MemberAccountFragment";
};
export type MemberAccountFragment$key = {
	readonly " $data"?: MemberAccountFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"MemberAccountFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "MemberAccountFragment",
	selections: [
		{
			args: null,
			kind: "FragmentSpread",
			name: "MemberControlsAccountFragment",
		},
	],
	type: "Account",
	abstractKey: null,
};

(node as any).hash = "21676df6faac89ece04f53f100d803dd";

export default node;
