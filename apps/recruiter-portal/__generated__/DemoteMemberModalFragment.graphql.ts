import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type DemoteMemberModalFragment$data = {
	readonly node: {
		readonly id: string;
	};
	readonly " $fragmentType": "DemoteMemberModalFragment";
};
export type DemoteMemberModalFragment$key = {
	readonly " $data"?: DemoteMemberModalFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"DemoteMemberModalFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "DemoteMemberModalFragment",
	selections: [
		{
			alias: null,
			args: null,
			concreteType: "Account",
			kind: "LinkedField",
			name: "node",
			plural: false,
			selections: [
				{
					alias: null,
					args: null,
					kind: "ScalarField",
					name: "id",
					storageKey: null,
				},
			],
			storageKey: null,
		},
	],
	type: "OrganizationMemberEdge",
	abstractKey: null,
};

(node as any).hash = "1622ef6235fcb39769e390e45ad9e39e";

export default node;
