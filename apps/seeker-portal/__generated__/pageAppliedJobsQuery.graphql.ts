import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type pageAppliedJobsQuery$variables = Record<PropertyKey, never>;
export type pageAppliedJobsQuery$data = {
	readonly " $fragmentSpreads": FragmentRefs<"AppliedJobsClientComponentFragment">;
};
export type pageAppliedJobsQuery = {
	response: pageAppliedJobsQuery$data;
	variables: pageAppliedJobsQuery$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = [
			{
				kind: "Literal",
				name: "first",
				value: 10,
			},
		],
		v1 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		},
		v2 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "slug",
			storageKey: null,
		},
		v3 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		};
	return {
		fragment: {
			argumentDefinitions: [],
			kind: "Fragment",
			metadata: null,
			name: "pageAppliedJobsQuery",
			selections: [
				{
					args: null,
					kind: "FragmentSpread",
					name: "AppliedJobsClientComponentFragment",
				},
			],
			type: "Query",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [],
			kind: "Operation",
			name: "pageAppliedJobsQuery",
			selections: [
				{
					alias: null,
					args: v0 /*: any*/,
					concreteType: "JobApplicantConnection",
					kind: "LinkedField",
					name: "appliedJobs",
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
											alias: null,
											args: null,
											concreteType: "Job",
											kind: "LinkedField",
											name: "job",
											plural: false,
											selections: [
												v1 /*: any*/,
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "isSaved",
													storageKey: null,
												},
												v2 /*: any*/,
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "title",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "description",
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
														v2 /*: any*/,
														v1 /*: any*/,
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
											],
											storageKey: null,
										},
										v3 /*: any*/,
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
					storageKey: "appliedJobs(first:10)",
				},
				{
					alias: null,
					args: v0 /*: any*/,
					filters: null,
					handle: "connection",
					key: "AppliedJobListFragment_appliedJobs",
					kind: "LinkedHandle",
					name: "appliedJobs",
				},
				{
					alias: null,
					args: null,
					concreteType: null,
					kind: "LinkedField",
					name: "viewer",
					plural: false,
					selections: [
						v3 /*: any*/,
						{
							kind: "TypeDiscriminator",
							abstractKey: "__isViewerPayload",
						},
						{
							kind: "InlineFragment",
							selections: [v1 /*: any*/],
							type: "Node",
							abstractKey: "__isNode",
						},
					],
					storageKey: null,
				},
			],
		},
		params: {
			id: "ac7e591790abd06cd34b973f9d13c363",
			metadata: {},
			name: "pageAppliedJobsQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "6d7aa6e86f76c7d07067b22c6367d84c";

export default node;
