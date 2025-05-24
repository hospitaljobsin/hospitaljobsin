import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type OrganizationDetailsInternalFragment$data = {
	readonly description: string | null | undefined;
	readonly email: string | null | undefined;
	readonly location: string | null | undefined;
	readonly logoUrl: string;
	readonly name: string;
	readonly website: string | null | undefined;
	readonly " $fragmentType": "OrganizationDetailsInternalFragment";
};
export type OrganizationDetailsInternalFragment$key = {
	readonly " $data"?: OrganizationDetailsInternalFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationDetailsInternalFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "OrganizationDetailsInternalFragment",
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
			name: "description",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "website",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "email",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "location",
			storageKey: null,
		},
	],
	type: "Organization",
	abstractKey: null,
};

(node as any).hash = "f3001b77ac7ba4af02b80c9184d4951b";

export default node;
