import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type DeleteInviteModalOrganizationFragment$data = {
	readonly id: string;
	readonly " $fragmentType": "DeleteInviteModalOrganizationFragment";
};
export type DeleteInviteModalOrganizationFragment$key = {
	readonly " $data"?: DeleteInviteModalOrganizationFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"DeleteInviteModalOrganizationFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "DeleteInviteModalOrganizationFragment",
	selections: [
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		},
	],
	type: "Organization",
	abstractKey: null,
};

(node as any).hash = "19a246e49da06210b29a2efeb8480569";

export default node;
