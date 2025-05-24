import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type OrganizationListPaginationQuery$variables = {
	count?: number | null | undefined;
	cursor?: string | null | undefined;
	id: string;
};
export type OrganizationListPaginationQuery$data = {
	readonly node:
		| {
				readonly " $fragmentSpreads": FragmentRefs<"OrganizationListInternalFragment">;
		  }
		| null
		| undefined;
};
export type OrganizationListPaginationQuery = {
	response: OrganizationListPaginationQuery$data;
	variables: OrganizationListPaginationQuery$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = [
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
				name: "id",
			},
		],
		v1 = [
			{
				kind: "Variable",
				name: "id",
				variableName: "id",
			},
		],
		v2 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v3 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		},
		v4 = [
			{
				kind: "Variable",
				name: "after",
				variableName: "cursor",
			},
			{
				kind: "Variable",
				name: "first",
				variableName: "count",
			},
		];
	return {
		fragment: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "OrganizationListPaginationQuery",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "node",
					plural: false,
					selections: [
						{
							args: [
								{
									kind: "Variable",
									name: "count",
									variableName: "count",
								},
								{
									kind: "Variable",
									name: "cursor",
									variableName: "cursor",
								},
							],
							kind: "FragmentSpread",
							name: "OrganizationListInternalFragment",
						},
					],
					storageKey: null,
				},
			],
			type: "Query",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Operation",
			name: "OrganizationListPaginationQuery",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "node",
					plural: false,
					selections: [
						v2 /*: any*/,
						v3 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								{
									alias: null,
									args: v4 /*: any*/,
									concreteType: "OrganizationConnection",
									kind: "LinkedField",
									name: "organizations",
									plural: false,
									selections: [
										{
											alias: null,
											args: null,
											concreteType: "OrganizationEdge",
											kind: "LinkedField",
											name: "edges",
											plural: true,
											selections: [
												{
													alias: null,
													args: null,
													concreteType: "Organization",
													kind: "LinkedField",
													name: "node",
													plural: false,
													selections: [
														v3 /*: any*/,
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
														v2 /*: any*/,
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
								{
									alias: null,
									args: v4 /*: any*/,
									filters: null,
									handle: "connection",
									key: "OrganizationListFragment_organizations",
									kind: "LinkedHandle",
									name: "organizations",
								},
							],
							type: "Account",
							abstractKey: null,
						},
					],
					storageKey: null,
				},
			],
		},
		params: {
			id: "2b0b61df761a02eac871eaf7121121f4",
			metadata: {},
			name: "OrganizationListPaginationQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "6108b8a71eec42ff9d19636c00857cef";

export default node;
