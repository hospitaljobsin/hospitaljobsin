import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type RequestSudoModeViewClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"RequestSudoViewFragment">;
	readonly " $fragmentType": "RequestSudoModeViewClientComponentFragment";
};
export type RequestSudoModeViewClientComponentFragment$key = {
	readonly " $data"?: RequestSudoModeViewClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"RequestSudoModeViewClientComponentFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "RequestSudoModeViewClientComponentFragment",
	selections: [
		{
			args: null,
			kind: "FragmentSpread",
			name: "RequestSudoViewFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "79c05c95ea2b5e3eeeb9d7951914431f";

export default node;
