import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type JobFragment$data = {
	readonly applicantCount: {
		readonly applied: number;
		readonly interviewed: number;
		readonly offered: number;
		readonly onHold: number;
		readonly shortlisted: number;
	};
	readonly createdAt: any;
	readonly skills: ReadonlyArray<string>;
	readonly slug: string;
	readonly title: string;
	readonly vacancies: number | null | undefined;
	readonly viewCount: number;
	readonly " $fragmentType": "JobFragment";
};
export type JobFragment$key = {
	readonly " $data"?: JobFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"JobFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "JobFragment",
	selections: [
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
			name: "title",
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
			name: "viewCount",
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
			kind: "RequiredField",
			field: {
				alias: null,
				args: null,
				concreteType: "JobApplicantCount",
				kind: "LinkedField",
				name: "applicantCount",
				plural: false,
				selections: [
					{
						alias: null,
						args: null,
						kind: "ScalarField",
						name: "applied",
						storageKey: null,
					},
					{
						alias: null,
						args: null,
						kind: "ScalarField",
						name: "shortlisted",
						storageKey: null,
					},
					{
						alias: null,
						args: null,
						kind: "ScalarField",
						name: "interviewed",
						storageKey: null,
					},
					{
						alias: null,
						args: null,
						kind: "ScalarField",
						name: "onHold",
						storageKey: null,
					},
					{
						alias: null,
						args: null,
						kind: "ScalarField",
						name: "offered",
						storageKey: null,
					},
				],
				storageKey: null,
			},
			action: "THROW",
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "vacancies",
			storageKey: null,
		},
	],
	type: "Job",
	abstractKey: null,
};

(node as any).hash = "efb20eb919a7de137815ec2f4cd72012";

export default node;
