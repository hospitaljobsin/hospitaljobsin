import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type OrganizationJobsListInternalFragment$data = {
	readonly id: string;
	readonly jobs: {
		readonly edges: ReadonlyArray<{
			readonly node: {
				readonly id: string;
				readonly " $fragmentSpreads": FragmentRefs<"JobFragment">;
			};
		}>;
		readonly pageInfo: {
			readonly hasNextPage: boolean;
		};
	};
	readonly " $fragmentType": "OrganizationJobsListInternalFragment";
};
export type OrganizationJobsListInternalFragment$key = {
	readonly " $data"?: OrganizationJobsListInternalFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsListInternalFragment">;
};

import OrganizationJobsListPaginationQuery_graphql from "./OrganizationJobsListPaginationQuery.graphql";

const node: ReaderFragment = (() => {
	var v0 = ["jobs"],
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
				operation: OrganizationJobsListPaginationQuery_graphql,
				identifierInfo: {
					identifierField: "id",
					identifierQueryVariableName: "id",
				},
			},
		},
		name: "OrganizationJobsListInternalFragment",
		selections: [
			{
				alias: "jobs",
				args: [
					{
						kind: "Variable",
						name: "searchTerm",
						variableName: "searchTerm",
					},
				],
				concreteType: "JobConnection",
				kind: "LinkedField",
				name: "__OrganizationJobsListInternalFragment_jobs_connection",
				plural: false,
				selections: [
					{
						alias: null,
						args: null,
						concreteType: "JobEdge",
						kind: "LinkedField",
						name: "edges",
						plural: true,
						selections: [
							{
								alias: null,
								args: null,
								concreteType: "Job",
								kind: "LinkedField",
								name: "node",
								plural: false,
								selections: [
									v1 /*: any*/,
									{
										args: null,
										kind: "FragmentSpread",
										name: "JobFragment",
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
		type: "Organization",
		abstractKey: null,
	};
})();

(node as any).hash = "b8c54d46c2d5ba62662866356b02272d";

export default node;
