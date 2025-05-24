import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type JobDetailsFragment$data = {
	readonly organization:
		| {
				readonly __typename: "Organization";
				readonly job:
					| {
							readonly __typename: "Job";
							readonly " $fragmentSpreads": FragmentRefs<"JobDetailsInternalFragment">;
					  }
					| {
							// This will never be '%other', but we need some
							// value in case none of the concrete values match.
							readonly __typename: "%other";
					  };
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly viewer: {
		readonly __typename: string;
		readonly " $fragmentSpreads": FragmentRefs<"JobControlsAuthFragment">;
	};
	readonly " $fragmentType": "JobDetailsFragment";
};
export type JobDetailsFragment$key = {
	readonly " $data"?: JobDetailsFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"JobDetailsFragment">;
};

const node: ReaderFragment = (() => {
	var v0 = {
		alias: null,
		args: null,
		kind: "ScalarField",
		name: "__typename",
		storageKey: null,
	};
	return {
		argumentDefinitions: [
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "jobSlug",
			},
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "slug",
			},
		],
		kind: "Fragment",
		metadata: null,
		name: "JobDetailsFragment",
		selections: [
			{
				alias: null,
				args: [
					{
						kind: "Variable",
						name: "slug",
						variableName: "slug",
					},
				],
				concreteType: null,
				kind: "LinkedField",
				name: "organization",
				plural: false,
				selections: [
					v0 /*: any*/,
					{
						kind: "InlineFragment",
						selections: [
							{
								alias: null,
								args: [
									{
										kind: "Variable",
										name: "slug",
										variableName: "jobSlug",
									},
								],
								concreteType: null,
								kind: "LinkedField",
								name: "job",
								plural: false,
								selections: [
									v0 /*: any*/,
									{
										kind: "InlineFragment",
										selections: [
											{
												args: null,
												kind: "FragmentSpread",
												name: "JobDetailsInternalFragment",
											},
										],
										type: "Job",
										abstractKey: null,
									},
								],
								storageKey: null,
							},
						],
						type: "Organization",
						abstractKey: null,
					},
				],
				storageKey: null,
			},
			{
				alias: null,
				args: null,
				concreteType: null,
				kind: "LinkedField",
				name: "viewer",
				plural: false,
				selections: [
					v0 /*: any*/,
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
})();

(node as any).hash = "9707872952474a570adac08705444b22";

export default node;
