import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type JobControlsUnsaveMutation$variables = {
	jobId: string;
};
export type JobControlsUnsaveMutation$data = {
	readonly unsaveJob: {
		readonly savedJobEdge?: {
			readonly node: {
				readonly id: string;
				readonly " $fragmentSpreads": FragmentRefs<
					"JobControlsFragment" | "JobDetailsInternalFragment"
				>;
			};
		};
	};
};
export type JobControlsUnsaveMutation = {
	response: JobControlsUnsaveMutation$data;
	variables: JobControlsUnsaveMutation$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = [
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "jobId",
			},
		],
		v1 = [
			{
				kind: "Variable",
				name: "jobId",
				variableName: "jobId",
			},
		],
		v2 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		},
		v3 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "slug",
			storageKey: null,
		},
		v4 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "description",
			storageKey: null,
		};
	return {
		fragment: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "JobControlsUnsaveMutation",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "unsaveJob",
					plural: false,
					selections: [
						{
							kind: "InlineFragment",
							selections: [
								{
									alias: null,
									args: null,
									concreteType: "SavedJobEdge",
									kind: "LinkedField",
									name: "savedJobEdge",
									plural: false,
									selections: [
										{
											alias: null,
											args: null,
											concreteType: "Job",
											kind: "LinkedField",
											name: "node",
											plural: false,
											selections: [
												v2 /*: any*/,
												{
													args: null,
													kind: "FragmentSpread",
													name: "JobDetailsInternalFragment",
												},
												{
													args: null,
													kind: "FragmentSpread",
													name: "JobControlsFragment",
												},
											],
											storageKey: null,
										},
									],
									storageKey: null,
								},
							],
							type: "UnsaveJobSuccess",
							abstractKey: null,
						},
					],
					storageKey: null,
				},
			],
			type: "Mutation",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Operation",
			name: "JobControlsUnsaveMutation",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "unsaveJob",
					plural: false,
					selections: [
						{
							alias: null,
							args: null,
							kind: "ScalarField",
							name: "__typename",
							storageKey: null,
						},
						{
							kind: "InlineFragment",
							selections: [
								{
									alias: null,
									args: null,
									concreteType: "SavedJobEdge",
									kind: "LinkedField",
									name: "savedJobEdge",
									plural: false,
									selections: [
										{
											alias: null,
											args: null,
											concreteType: "Job",
											kind: "LinkedField",
											name: "node",
											plural: false,
											selections: [
												v2 /*: any*/,
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "isSaved",
													storageKey: null,
												},
												v3 /*: any*/,
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "title",
													storageKey: null,
												},
												v4 /*: any*/,
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
														v3 /*: any*/,
														v2 /*: any*/,
														v4 /*: any*/,
													],
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
													name: "workMode",
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
													name: "skills",
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
													name: "hasSalaryRange",
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
													name: "hasExperienceRange",
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
													name: "createdAt",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "isApplied",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "externalApplicationUrl",
													storageKey: null,
												},
											],
											storageKey: null,
										},
									],
									storageKey: null,
								},
							],
							type: "UnsaveJobSuccess",
							abstractKey: null,
						},
					],
					storageKey: null,
				},
			],
		},
		params: {
			id: "82db27d8f0bd17d99db618f32ab2682d",
			metadata: {},
			name: "JobControlsUnsaveMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "954830eecbda92d09668e7af669c5ea8";

export default node;
