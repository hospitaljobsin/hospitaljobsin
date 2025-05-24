import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type pageJobApplicationFormViewQuery$variables = {
	jobSlug: string;
	slug: string;
};
export type pageJobApplicationFormViewQuery$data = {
	readonly " $fragmentSpreads": FragmentRefs<
		| "JobApplicationFormViewClientComponentFragment"
		| "pageJobApplicationFormMetadataFragment"
	>;
};
export type pageJobApplicationFormViewQuery = {
	response: pageJobApplicationFormViewQuery$data;
	variables: pageJobApplicationFormViewQuery$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "jobSlug",
		},
		v1 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "slug",
		},
		v2 = [v0 /*: any*/, v1 /*: any*/],
		v3 = {
			kind: "Variable",
			name: "slug",
			variableName: "slug",
		},
		v4 = [v3 /*: any*/],
		v5 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v6 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "name",
			storageKey: null,
		},
		v7 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "description",
			storageKey: null,
		},
		v8 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "logoUrl",
			storageKey: null,
		},
		v9 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "isAdmin",
			storageKey: null,
		},
		v10 = [
			{
				kind: "Variable",
				name: "slug",
				variableName: "jobSlug",
			},
		],
		v11 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "title",
			storageKey: null,
		},
		v12 = [
			{
				kind: "Variable",
				name: "jobSlug",
				variableName: "jobSlug",
			},
			v3 /*: any*/,
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
			argumentDefinitions: v2 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "pageJobApplicationFormViewQuery",
			selections: [
				{
					kind: "InlineDataFragmentSpread",
					name: "pageJobApplicationFormMetadataFragment",
					selections: [
						{
							alias: null,
							args: v4 /*: any*/,
							concreteType: null,
							kind: "LinkedField",
							name: "organization",
							plural: false,
							selections: [
								v5 /*: any*/,
								{
									kind: "InlineFragment",
									selections: [
										v6 /*: any*/,
										v7 /*: any*/,
										v8 /*: any*/,
										v9 /*: any*/,
										{
											alias: null,
											args: v10 /*: any*/,
											concreteType: null,
											kind: "LinkedField",
											name: "job",
											plural: false,
											selections: [
												v5 /*: any*/,
												{
													kind: "InlineFragment",
													selections: [v11 /*: any*/],
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
					argumentDefinitions: v2 /*: any*/,
				},
				{
					args: v12 /*: any*/,
					kind: "FragmentSpread",
					name: "JobApplicationFormViewClientComponentFragment",
				},
			],
			type: "Query",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
			kind: "Operation",
			name: "pageJobApplicationFormViewQuery",
			selections: [
				{
					alias: null,
					args: v4 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "organization",
					plural: false,
					selections: [
						v5 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								v6 /*: any*/,
								v7 /*: any*/,
								v8 /*: any*/,
								v9 /*: any*/,
								{
									alias: null,
									args: v10 /*: any*/,
									concreteType: null,
									kind: "LinkedField",
									name: "job",
									plural: false,
									selections: [
										v5 /*: any*/,
										{
											kind: "InlineFragment",
											selections: [
												v11 /*: any*/,
												v13 /*: any*/,
												{
													alias: null,
													args: null,
													concreteType: "JobApplicationForm",
													kind: "LinkedField",
													name: "applicationForm",
													plural: false,
													selections: [
														{
															alias: null,
															args: null,
															concreteType: "ApplicationField",
															kind: "LinkedField",
															name: "fields",
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
																	name: "defaultValue",
																	storageKey: null,
																},
																{
																	alias: null,
																	args: null,
																	kind: "ScalarField",
																	name: "isRequired",
																	storageKey: null,
																},
															],
															storageKey: null,
														},
														v13 /*: any*/,
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
			id: "56241aab1f1197a077a3233f622e775f",
			metadata: {},
			name: "pageJobApplicationFormViewQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "67ebcf232858070cb595ca207b278864";

export default node;
