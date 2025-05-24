import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type pageJobDetailViewQuery$variables = {
	jobSlug: string;
	slug: string;
};
export type pageJobDetailViewQuery$data = {
	readonly " $fragmentSpreads": FragmentRefs<
		"JobDetailViewClientComponentFragment" | "pageJobDetailMetadataFragment"
	>;
};
export type pageJobDetailViewQuery = {
	response: pageJobDetailViewQuery$data;
	variables: pageJobDetailViewQuery$variables;
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
			name: "isMember",
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
			name: "pageJobDetailViewQuery",
			selections: [
				{
					kind: "InlineDataFragmentSpread",
					name: "pageJobDetailMetadataFragment",
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
					name: "JobDetailViewClientComponentFragment",
				},
			],
			type: "Query",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
			kind: "Operation",
			name: "pageJobDetailViewQuery",
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
												v7 /*: any*/,
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
													name: "skills",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "minSalary",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "maxSalary",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "hasSalaryRange",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "minExperience",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "maxExperience",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "hasExperienceRange",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "currency",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "workMode",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "type",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "location",
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
													name: "updatedAt",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "isActive",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "externalApplicationUrl",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													concreteType: "JobApplicationForm",
													kind: "LinkedField",
													name: "applicationForm",
													plural: false,
													selections: [v5 /*: any*/, v13 /*: any*/],
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													concreteType: "Organization",
													kind: "LinkedField",
													name: "organization",
													plural: false,
													selections: [
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "isAdmin",
															storageKey: null,
														},
														v6 /*: any*/,
														v13 /*: any*/,
													],
													storageKey: null,
												},
												v13 /*: any*/,
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "viewCount",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													concreteType: "JobMetricPoint",
													kind: "LinkedField",
													name: "viewMetricPoints",
													plural: true,
													selections: [
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "timestamp",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "count",
															storageKey: null,
														},
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
			id: "50f0ad02297f86ac365abaff52f694e0",
			metadata: {},
			name: "pageJobDetailViewQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "684a8ee4e1ff9aaaaae5bb7f729cf2f9";

export default node;
