import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type InviteOrganizationFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"DeleteInviteModalOrganizationFragment">;
	readonly " $fragmentType": "InviteOrganizationFragment";
};
export type InviteOrganizationFragment$key = {
	readonly " $data"?: InviteOrganizationFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"InviteOrganizationFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "InviteOrganizationFragment",
	selections: [
		{
			args: null,
			kind: "FragmentSpread",
			name: "DeleteInviteModalOrganizationFragment",
		},
	],
	type: "Organization",
	abstractKey: null,
};

(node as any).hash = "0195e452b80ea1812c06a6016450d8f7";

export default node;
