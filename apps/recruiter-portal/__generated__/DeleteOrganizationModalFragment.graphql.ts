import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type DeleteOrganizationModalFragment$data = {
	readonly id: string;
	readonly name: string;
	readonly " $fragmentType": "DeleteOrganizationModalFragment";
};
export type DeleteOrganizationModalFragment$key = {
	readonly " $data"?: DeleteOrganizationModalFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"DeleteOrganizationModalFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "DeleteOrganizationModalFragment",
	selections: [
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "name",
			storageKey: null,
		},
	],
	type: "Organization",
	abstractKey: null,
};

(node as any).hash = "bad5ef14e235c3b6e5a8f9cc4dc2cb7b";

export default node;
