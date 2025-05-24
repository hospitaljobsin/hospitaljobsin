import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type CoordinatesInput = {
	latitude: number;
	longitude: number;
};
export type JobListRefetchQuery$variables = {
	coordinates?: CoordinatesInput | null | undefined;
	count?: number | null | undefined;
	cursor?: string | null | undefined;
	proximityKm?: number | null | undefined;
	searchTerm?: string | null | undefined;
};
export type JobListRefetchQuery$data = {
	readonly " $fragmentSpreads": FragmentRefs<"JobListInternalFragment">;
};
export type JobListRefetchQuery = {
	response: JobListRefetchQuery$data;
	variables: JobListRefetchQuery$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = [
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "coordinates",
			},
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
				name: "proximityKm",
			},
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "searchTerm",
			},
		],
		v1 = {
			kind: "Variable",
			name: "coordinates",
			variableName: "coordinates",
		},
		v2 = {
			kind: "Variable",
			name: "proximityKm",
			variableName: "proximityKm",
		},
		v3 = {
			kind: "Variable",
			name: "searchTerm",
			variableName: "searchTerm",
		},
		v4 = [
			{
				kind: "Variable",
				name: "after",
				variableName: "cursor",
			},
			v1 /*: any*/,
			{
				kind: "Variable",
				name: "first",
				variableName: "count",
			},
			v2 /*: any*/,
			v3 /*: any*/,
		],
		v5 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		},
		v6 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "slug",
			storageKey: null,
		};
	return {
		fragment: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "JobListRefetchQuery",
			selections: [
				{
					args: [
						v1 /*: any*/,
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
						v2 /*: any*/,
						v3 /*: any*/,
					],
					kind: "FragmentSpread",
					name: "JobListInternalFragment",
				},
			],
			type: "Query",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Operation",
			name: "JobListRefetchQuery",
			selections: [
				{
					alias: null,
					args: v4 /*: any*/,
					concreteType: "JobConnection",
					kind: "LinkedField",
					name: "jobs",
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
										v5 /*: any*/,
										{
											alias: null,
											args: null,
											kind: "ScalarField",
											name: "isSaved",
											storageKey: null,
										},
										v6 /*: any*/,
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
												v6 /*: any*/,
												v5 /*: any*/,
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
				{
					alias: null,
					args: v4 /*: any*/,
					filters: ["searchTerm", "coordinates", "proximityKm"],
					handle: "connection",
					key: "JobListFragment_jobs",
					kind: "LinkedHandle",
					name: "jobs",
				},
			],
		},
		params: {
			id: "be1dc1c695417e060f8c009ea33bd537",
			metadata: {},
			name: "JobListRefetchQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "31b36d35767a47445074efcb26869bcb";

export default node;
