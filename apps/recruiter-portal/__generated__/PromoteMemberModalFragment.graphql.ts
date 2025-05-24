import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type PromoteMemberModalFragment$data = {
	readonly node: {
		readonly id: string;
	};
	readonly " $fragmentType": "PromoteMemberModalFragment";
};
export type PromoteMemberModalFragment$key = {
	readonly " $data"?: PromoteMemberModalFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"PromoteMemberModalFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "PromoteMemberModalFragment",
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

(node as any).hash = "66d448a849632f9bf42987495f2707b0";

export default node;
