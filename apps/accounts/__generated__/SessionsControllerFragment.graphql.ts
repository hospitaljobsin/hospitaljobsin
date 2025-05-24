import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type SessionsControllerFragment$data = {
	readonly sudoModeExpiresAt: any | null | undefined;
	readonly " $fragmentType": "SessionsControllerFragment";
};
export type SessionsControllerFragment$key = {
	readonly " $data"?: SessionsControllerFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"SessionsControllerFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "SessionsControllerFragment",
	selections: [
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "sudoModeExpiresAt",
			storageKey: null,
		},
	],
	type: "Account",
	abstractKey: null,
};

(node as any).hash = "439dbb975368bce4d7e45df76a380eee";

export default node;
