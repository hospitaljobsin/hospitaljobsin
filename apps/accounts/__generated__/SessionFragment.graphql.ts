import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type SessionFragment$data = {
	readonly createdAt: any;
	readonly id: string;
	readonly ipAddress: string;
	readonly userAgent: string;
	readonly " $fragmentSpreads": FragmentRefs<"DeleteSessionModalFragment">;
	readonly " $fragmentType": "SessionFragment";
};
export type SessionFragment$key = {
	readonly " $data"?: SessionFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"SessionFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "SessionFragment",
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
			name: "userAgent",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "ipAddress",
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
			args: null,
			kind: "FragmentSpread",
			name: "DeleteSessionModalFragment",
		},
	],
	type: "Session",
	abstractKey: null,
};

(node as any).hash = "a3af001ba0144deff5651a36cf01ede4";

export default node;
