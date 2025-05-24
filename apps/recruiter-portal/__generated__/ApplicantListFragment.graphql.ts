import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type ApplicantListFragment$data = {
	readonly applicants: {
		readonly edges: ReadonlyArray<{
			readonly node: {
				readonly id: string;
				readonly " $fragmentSpreads": FragmentRefs<"ApplicantFragment">;
			};
		}>;
		readonly pageInfo: {
			readonly hasNextPage: boolean;
		};
	};
	readonly id: string;
	readonly " $fragmentType": "ApplicantListFragment";
};
export type ApplicantListFragment$key = {
	readonly " $data"?: ApplicantListFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"ApplicantListFragment">;
};

import ApplicantListPaginationQuery_graphql from "./ApplicantListPaginationQuery.graphql";

const node: ReaderFragment = (() => {
	var v0 = ["applicants"],
		v1 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		};
	return {
		argumentDefinitions: [
			{
				defaultValue: 10,
				kind: "LocalArgument",
				name: "count",
			},
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "cursor",
			},
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "searchTerm",
			},
			{
				defaultValue: true,
				kind: "LocalArgument",
				name: "showStatus",
			},
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "status",
			},
		],
		kind: "Fragment",
		metadata: {
			connection: [
				{
					count: "count",
					cursor: "cursor",
					direction: "forward",
					path: v0 /*: any*/,
				},
			],
			refetch: {
				connection: {
					forward: {
						count: "count",
						cursor: "cursor",
					},
					backward: null,
					path: v0 /*: any*/,
				},
				fragmentPathInResult: ["node"],
				operation: ApplicantListPaginationQuery_graphql,
				identifierInfo: {
					identifierField: "id",
					identifierQueryVariableName: "id",
				},
			},
		},
		name: "ApplicantListFragment",
		selections: [
			{
				alias: "applicants",
				args: [
					{
						kind: "Variable",
						name: "searchTerm",
						variableName: "searchTerm",
					},
					{
						kind: "Variable",
						name: "status",
						variableName: "status",
					},
				],
				concreteType: "JobApplicantConnection",
				kind: "LinkedField",
				name: "__ApplicantListFragment_applicants_connection",
				plural: false,
				selections: [
					{
						alias: null,
						args: null,
						concreteType: "JobApplicantEdge",
						kind: "LinkedField",
						name: "edges",
						plural: true,
						selections: [
							{
								alias: null,
								args: null,
								concreteType: "JobApplicant",
								kind: "LinkedField",
								name: "node",
								plural: false,
								selections: [
									v1 /*: any*/,
									{
										args: [
											{
												kind: "Variable",
												name: "showStatus",
												variableName: "showStatus",
											},
										],
										kind: "FragmentSpread",
										name: "ApplicantFragment",
									},
									{
										alias: null,
										args: null,
										kind: "ScalarField",
										name: "__typename",
										storageKey: null,
									},
								],
								storageKey: null,
							},
							{
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "cursor",
								storageKey: null,
							},
						],
						storageKey: null,
					},
					{
						alias: null,
						args: null,
						concreteType: "PageInfo",
						kind: "LinkedField",
						name: "pageInfo",
						plural: false,
						selections: [
							{
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "hasNextPage",
								storageKey: null,
							},
							{
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "endCursor",
								storageKey: null,
							},
						],
						storageKey: null,
					},
				],
				storageKey: null,
			},
			v1 /*: any*/,
		],
		type: "Job",
		abstractKey: null,
	};
})();

(node as any).hash = "c6dcda356daa0d31b0fe126462e1c951";

export default node;
