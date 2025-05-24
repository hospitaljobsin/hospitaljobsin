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
				defaultValue: true,
				kind: "LocalArgument",
				name: "isActive",
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
						name: "isActive",
						variableName: "isActive",
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
										args: [
											{
												kind: "Literal",
												name: "showOrganization",
												value: false,
											},
										],
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

(node as any).hash = "6d964eb87550a2b2ba1451b870f01bee";

export default node;
