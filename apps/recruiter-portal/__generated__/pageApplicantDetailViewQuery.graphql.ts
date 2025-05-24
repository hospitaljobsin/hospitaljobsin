import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type pageApplicantDetailViewQuery$variables = {
	applicantSlug: string;
	jobSlug: string;
	slug: string;
};
export type pageApplicantDetailViewQuery$data = {
	readonly " $fragmentSpreads": FragmentRefs<
		| "ApplicantDetailViewClientComponentFragment"
		| "pageApplicantDetailMetadataFragment"
	>;
};
export type pageApplicantDetailViewQuery = {
	response: pageApplicantDetailViewQuery$data;
	variables: pageApplicantDetailViewQuery$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "applicantSlug",
		},
		v1 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "jobSlug",
		},
		v2 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "slug",
		},
		v3 = [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/],
		v4 = {
			kind: "Variable",
			name: "slug",
			variableName: "slug",
		},
		v5 = [v4 /*: any*/],
		v6 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v7 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "isMember",
			storageKey: null,
		},
		v8 = [
			{
				kind: "Variable",
				name: "slug",
				variableName: "jobSlug",
			},
		],
		v9 = [
			{
				kind: "Variable",
				name: "slug",
				variableName: "applicantSlug",
			},
		],
		v10 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "fullName",
			storageKey: null,
		},
		v11 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "avatarUrl",
			storageKey: null,
		},
		v12 = [
			{
				kind: "Variable",
				name: "applicantSlug",
				variableName: "applicantSlug",
			},
			{
				kind: "Variable",
				name: "jobSlug",
				variableName: "jobSlug",
			},
			v4 /*: any*/,
		],
		v13 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		},
		v14 = {
			kind: "InlineFragment",
			selections: [v13 /*: any*/],
			type: "Node",
			abstractKey: "__isNode",
		};
	return {
		fragment: {
			argumentDefinitions: v3 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "pageApplicantDetailViewQuery",
			selections: [
				{
					kind: "InlineDataFragmentSpread",
					name: "pageApplicantDetailMetadataFragment",
					selections: [
						{
							alias: null,
							args: v5 /*: any*/,
							concreteType: null,
							kind: "LinkedField",
							name: "organization",
							plural: false,
							selections: [
								v6 /*: any*/,
								{
									kind: "InlineFragment",
									selections: [
										v7 /*: any*/,
										{
											alias: null,
											args: v8 /*: any*/,
											concreteType: null,
											kind: "LinkedField",
											name: "job",
											plural: false,
											selections: [
												v6 /*: any*/,
												{
													kind: "InlineFragment",
													selections: [
														{
															alias: null,
															args: v9 /*: any*/,
															concreteType: null,
															kind: "LinkedField",
															name: "jobApplicant",
															plural: false,
															selections: [
																v6 /*: any*/,
																{
																	kind: "InlineFragment",
																	selections: [
																		{
																			alias: null,
																			args: null,
																			concreteType: "Account",
																			kind: "LinkedField",
																			name: "account",
																			plural: false,
																			selections: [
																				v10 /*: any*/,
																				v11 /*: any*/,
																			],
																			storageKey: null,
																		},
																	],
																	type: "JobApplicant",
																	abstractKey: null,
																},
															],
															storageKey: null,
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
					],
					args: v12 /*: any*/,
					argumentDefinitions: v3 /*: any*/,
				},
				{
					args: v12 /*: any*/,
					kind: "FragmentSpread",
					name: "ApplicantDetailViewClientComponentFragment",
				},
			],
			type: "Query",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [v2 /*: any*/, v1 /*: any*/, v0 /*: any*/],
			kind: "Operation",
			name: "pageApplicantDetailViewQuery",
			selections: [
				{
					alias: null,
					args: v5 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "organization",
					plural: false,
					selections: [
						v6 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								v7 /*: any*/,
								{
									alias: null,
									args: v8 /*: any*/,
									concreteType: null,
									kind: "LinkedField",
									name: "job",
									plural: false,
									selections: [
										v6 /*: any*/,
										{
											kind: "InlineFragment",
											selections: [
												{
													alias: null,
													args: v9 /*: any*/,
													concreteType: null,
													kind: "LinkedField",
													name: "jobApplicant",
													plural: false,
													selections: [
														v6 /*: any*/,
														{
															kind: "InlineFragment",
															selections: [
																{
																	alias: null,
																	args: null,
																	concreteType: "Account",
																	kind: "LinkedField",
																	name: "account",
																	plural: false,
																	selections: [
																		v10 /*: any*/,
																		v11 /*: any*/,
																		v13 /*: any*/,
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
																			concreteType: null,
																			kind: "LinkedField",
																			name: "profile",
																			plural: false,
																			selections: [
																				v6 /*: any*/,
																				{
																					kind: "InlineFragment",
																					selections: [
																						{
																							alias: null,
																							args: null,
																							concreteType: "Address",
																							kind: "LinkedField",
																							name: "address",
																							plural: false,
																							selections: [
																								{
																									alias: null,
																									args: null,
																									kind: "ScalarField",
																									name: "city",
																									storageKey: null,
																								},
																								{
																									alias: null,
																									args: null,
																									kind: "ScalarField",
																									name: "state",
																									storageKey: null,
																								},
																							],
																							storageKey: null,
																						},
																					],
																					type: "Profile",
																					abstractKey: null,
																				},
																				v14 /*: any*/,
																			],
																			storageKey: null,
																		},
																	],
																	storageKey: null,
																},
																{
																	alias: null,
																	args: null,
																	kind: "ScalarField",
																	name: "status",
																	storageKey: null,
																},
																{
																	alias: null,
																	args: null,
																	kind: "ScalarField",
																	name: "resumeUrl",
																	storageKey: null,
																},
																{
																	alias: null,
																	args: null,
																	concreteType: "ApplicantField",
																	kind: "LinkedField",
																	name: "applicantFields",
																	plural: true,
																	selections: [
																		{
																			alias: null,
																			args: null,
																			kind: "ScalarField",
																			name: "fieldName",
																			storageKey: null,
																		},
																		{
																			alias: null,
																			args: null,
																			kind: "ScalarField",
																			name: "fieldValue",
																			storageKey: null,
																		},
																	],
																	storageKey: null,
																},
															],
															type: "JobApplicant",
															abstractKey: null,
														},
														v14 /*: any*/,
													],
													storageKey: null,
												},
											],
											type: "Job",
											abstractKey: null,
										},
										v14 /*: any*/,
									],
									storageKey: null,
								},
							],
							type: "Organization",
							abstractKey: null,
						},
						v14 /*: any*/,
					],
					storageKey: null,
				},
			],
		},
		params: {
			id: "2e8de82a7484419b72ce1c8eb50f9877",
			metadata: {},
			name: "pageApplicantDetailViewQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "35415241721be871bfbe55145bc2514e";

export default node;
