import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type DeleteInviteModalFragment$data = {
	readonly email: string;
	readonly id: string;
	readonly " $fragmentType": "DeleteInviteModalFragment";
};
export type DeleteInviteModalFragment$key = {
	readonly " $data"?: DeleteInviteModalFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"DeleteInviteModalFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "DeleteInviteModalFragment",
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
			name: "email",
			storageKey: null,
		},
	],
	type: "OrganizationInvite",
	abstractKey: null,
};

(node as any).hash = "35e67b44e3176519ae015fa383d5bdea";

export default node;
