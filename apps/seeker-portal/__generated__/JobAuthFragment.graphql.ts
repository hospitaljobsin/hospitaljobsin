import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type JobAuthFragment$data = {
	readonly __typename: string;
	readonly " $fragmentType": "JobAuthFragment";
};
export type JobAuthFragment$key = {
	readonly " $data"?: JobAuthFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"JobAuthFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "JobAuthFragment",
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

(node as any).hash = "dff01ba726fdb61e390ec84beef42ed1";

export default node;
