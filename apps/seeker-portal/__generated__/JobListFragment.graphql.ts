import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type JobListFragment$data = {
	readonly viewer: {
		readonly " $fragmentSpreads": FragmentRefs<"JobControlsAuthFragment">;
	};
	readonly " $fragmentSpreads": FragmentRefs<"JobListInternalFragment">;
	readonly " $fragmentType": "JobListFragment";
};
export type JobListFragment$key = {
	readonly " $data"?: JobListFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"JobListFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [
		{
			defaultValue: null,
			kind: "LocalArgument",
			name: "coordinates",
		},
		{
			defaultValue: null,
			kind: "LocalArgument",
			name: "proximityKm",
		},
		{
			defaultValue: null,
			kind: "LocalArgument",
			name: "searchTerm",
		},
	],
	kind: "Fragment",
	metadata: null,
	name: "JobListFragment",
	selections: [
		{
			args: [
				{
					kind: "Variable",
					name: "coordinates",
					variableName: "coordinates",
				},
				{
					kind: "Variable",
					name: "proximityKm",
					variableName: "proximityKm",
				},
				{
					kind: "Variable",
					name: "searchTerm",
					variableName: "searchTerm",
				},
			],
			kind: "FragmentSpread",
			name: "JobListInternalFragment",
		},
		{
			alias: null,
			args: null,
			concreteType: null,
			kind: "LinkedField",
			name: "viewer",
			plural: false,
			selections: [
				{
					args: null,
					kind: "FragmentSpread",
					name: "JobControlsAuthFragment",
				},
			],
			storageKey: null,
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "0a472104d2d388e24b6cde5d056a9c28";

export default node;
