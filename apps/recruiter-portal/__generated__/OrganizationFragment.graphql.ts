import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type OrganizationFragment$data = {
	readonly description: string | null | undefined;
	readonly logoUrl: string;
	readonly name: string;
	readonly slug: string;
	readonly " $fragmentType": "OrganizationFragment";
};
export type OrganizationFragment$key = {
	readonly " $data"?: OrganizationFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "OrganizationFragment",
	selections: [
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "name",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "logoUrl",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "slug",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "description",
			storageKey: null,
		},
	],
	type: "Organization",
	abstractKey: null,
};

(node as any).hash = "6adc66fc681ed588d7d72b8a217e2e2f";

export default node;
