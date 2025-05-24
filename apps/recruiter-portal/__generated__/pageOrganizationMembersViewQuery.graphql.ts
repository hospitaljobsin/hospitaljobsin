import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type pageOrganizationMembersViewQuery$variables = {
	searchTerm?: string | null | undefined;
	slug: string;
};
export type pageOrganizationMembersViewQuery$data = {
	readonly " $fragmentSpreads": FragmentRefs<
		| "OrganizationMembersViewClientComponentFragment"
		| "pageOrganizationMembersMetadataFragment"
	>;
};
export type pageOrganizationMembersViewQuery = {
	response: pageOrganizationMembersViewQuery$data;
	variables: pageOrganizationMembersViewQuery$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "searchTerm",
		},
		v1 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "slug",
		},
		v2 = {
			kind: "Variable",
			name: "slug",
			variableName: "slug",
		},
		v3 = [v2 /*: any*/],
		v4 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v5 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "name",
			storageKey: null,
		},
		v6 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "description",
			storageKey: null,
		},
		v7 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "logoUrl",
			storageKey: null,
		},
		v8 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "isMember",
			storageKey: null,
		},
		v9 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "isAdmin",
			storageKey: null,
		},
		v10 = {
			kind: "Variable",
			name: "searchTerm",
			variableName: "searchTerm",
		},
		v11 = [
			{
				kind: "Literal",
				name: "first",
				value: 10,
			},
			v10 /*: any*/,
		],
		v12 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		},
		v13 = {
			kind: "InlineFragment",
			selections: [v12 /*: any*/],
			type: "Node",
			abstractKey: "__isNode",
		};
	return {
		fragment: {
			argumentDefinitions: [v0 /*: any*/, v1 /*: any*/],
			kind: "Fragment",
			metadata: null,
			name: "pageOrganizationMembersViewQuery",
			selections: [
				{
					kind: "InlineDataFragmentSpread",
					name: "pageOrganizationMembersMetadataFragment",
					selections: [
						{
							alias: null,
							args: v3 /*: any*/,
							concreteType: null,
							kind: "LinkedField",
							name: "organization",
							plural: false,
							selections: [
								v4 /*: any*/,
								{
									kind: "InlineFragment",
									selections: [
										v5 /*: any*/,
										v6 /*: any*/,
										v7 /*: any*/,
										v8 /*: any*/,
										v9 /*: any*/,
									],
									type: "Organization",
									abstractKey: null,
								},
							],
							storageKey: null,
						},
					],
					args: v3 /*: any*/,
					argumentDefinitions: [v1 /*: any*/],
				},
				{
					args: [v10 /*: any*/, v2 /*: any*/],
					kind: "FragmentSpread",
					name: "OrganizationMembersViewClientComponentFragment",
				},
			],
			type: "Query",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
			kind: "Operation",
			name: "pageOrganizationMembersViewQuery",
			selections: [
				{
					alias: null,
					args: v3 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "organization",
					plural: false,
					selections: [
						v4 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								v5 /*: any*/,
								v6 /*: any*/,
								v7 /*: any*/,
								v8 /*: any*/,
								v9 /*: any*/,
								{
									alias: null,
									args: v11 /*: any*/,
									concreteType: "OrganizationMemberConnection",
									kind: "LinkedField",
									name: "members",
									plural: false,
									selections: [
										{
											alias: null,
											args: null,
											concreteType: "OrganizationMemberEdge",
											kind: "LinkedField",
											name: "edges",
											plural: true,
											selections: [
												{
													alias: null,
													args: null,
													concreteType: "Account",
													kind: "LinkedField",
													name: "node",
													plural: false,
													selections: [
														v12 /*: any*/,
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "fullName",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "avatarUrl",
															storageKey: null,
														},
														v4 /*: any*/,
													],
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "role",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "createdAt",
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
										{
											kind: "ClientExtension",
											selections: [
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "__id",
													storageKey: null,
												},
											],
										},
									],
									storageKey: null,
								},
								{
									alias: null,
									args: v11 /*: any*/,
									filters: ["searchTerm"],
									handle: "connection",
									key: "OrganizationMembersListInternalFragment_members",
									kind: "LinkedHandle",
									name: "members",
								},
								v12 /*: any*/,
								{
									alias: null,
									args: null,
									kind: "ScalarField",
									name: "adminCount",
									storageKey: null,
								},
							],
							type: "Organization",
							abstractKey: null,
						},
						v13 /*: any*/,
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
						v4 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								{
									alias: null,
									args: null,
									kind: "ScalarField",
									name: "sudoModeExpiresAt",
									storageKey: null,
								},
							],
							type: "Account",
							abstractKey: null,
						},
						v13 /*: any*/,
					],
					storageKey: null,
				},
			],
		},
		params: {
			id: "10989f6c0c8c66c66d971176a44f4c02",
			metadata: {},
			name: "pageOrganizationMembersViewQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "6d2ae84fe2a5aac38c5c069151974bb7";

export default node;
