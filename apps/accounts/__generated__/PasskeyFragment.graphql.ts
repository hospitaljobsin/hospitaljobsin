import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type PasskeyFragment$data = {
	readonly createdAt: any;
	readonly id: string;
	readonly lastUsedAt: any;
	readonly nickname: string;
	readonly " $fragmentSpreads": FragmentRefs<
		"DeletePasskeyModalFragment" | "UpdatePasskeyModalFragment"
	>;
	readonly " $fragmentType": "PasskeyFragment";
};
export type PasskeyFragment$key = {
	readonly " $data"?: PasskeyFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"PasskeyFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "PasskeyFragment",
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
			name: "nickname",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "createdAt",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "lastUsedAt",
			storageKey: null,
		},
		{
			args: null,
			kind: "FragmentSpread",
			name: "UpdatePasskeyModalFragment",
		},
		{
			args: null,
			kind: "FragmentSpread",
			name: "DeletePasskeyModalFragment",
		},
	],
	type: "WebAuthnCredential",
	abstractKey: null,
};

(node as any).hash = "ddf5a3f8d8bc829f390f5350f9fa1fba";

export default node;
