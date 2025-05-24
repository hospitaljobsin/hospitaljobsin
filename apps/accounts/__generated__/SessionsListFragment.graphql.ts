import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type SessionsListFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<
		| "SessionAccountSudoFragment"
		| "SessionsControllerFragment"
		| "SessionsListCurrentSessionFragment"
		| "SessionsListInternalFragment"
	>;
	readonly " $fragmentType": "SessionsListFragment";
};
export type SessionsListFragment$key = {
	readonly " $data"?: SessionsListFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"SessionsListFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "SessionsListFragment",
	selections: [
		{
			args: null,
			kind: "FragmentSpread",
			name: "SessionsControllerFragment",
		},
		{
			args: null,
			kind: "FragmentSpread",
			name: "SessionsListInternalFragment",
		},
		{
			args: null,
			kind: "FragmentSpread",
			name: "SessionsListCurrentSessionFragment",
		},
		{
			args: null,
			kind: "FragmentSpread",
			name: "SessionAccountSudoFragment",
		},
	],
	type: "Account",
	abstractKey: null,
};

(node as any).hash = "38e1644233e9006164c547bc3baaf121";

export default node;
