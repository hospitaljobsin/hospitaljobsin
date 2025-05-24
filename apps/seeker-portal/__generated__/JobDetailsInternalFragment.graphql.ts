/**
 * @generated SignedSource<<d35668354b85486d0d17aba27c05a79d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
export type Currency = "INR" | "%future added value";
export type JobType =
	| "CONTRACT"
	| "FULL_TIME"
	| "INTERNSHIP"
	| "PART_TIME"
	| "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";

import type { FragmentRefs } from "relay-runtime";
export type JobDetailsInternalFragment$data = {
	readonly createdAt: any;
	readonly currency: Currency;
	readonly description: string | null | undefined;
	readonly externalApplicationUrl: string | null | undefined;
	readonly hasExperienceRange: boolean;
	readonly hasSalaryRange: boolean;
	readonly isApplied: boolean;
	readonly location: string | null | undefined;
	readonly maxExperience: number | null | undefined;
	readonly maxSalary: number | null | undefined;
	readonly minExperience: number | null | undefined;
	readonly minSalary: number | null | undefined;
	readonly organization: {
		readonly description: string | null | undefined;
		readonly logoUrl: string;
		readonly name: string;
		readonly slug: string;
	};
	readonly skills: ReadonlyArray<string>;
	readonly slug: string;
	readonly title: string;
	readonly type: JobType | null | undefined;
	readonly workMode: WorkMode | null | undefined;
	readonly " $fragmentSpreads": FragmentRefs<"JobControlsFragment">;
	readonly " $fragmentType": "JobDetailsInternalFragment";
};
export type JobDetailsInternalFragment$key = {
	readonly " $data"?: JobDetailsInternalFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"JobDetailsInternalFragment">;
};

const node: ReaderFragment = (() => {
	var v0 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "slug",
			storageKey: null,
		},
		v1 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "description",
			storageKey: null,
		};
	return {
		argumentDefinitions: [],
		kind: "Fragment",
		metadata: null,
		name: "JobDetailsInternalFragment",
		selections: [
			{
				args: null,
				kind: "FragmentSpread",
				name: "JobControlsFragment",
			},
			{
				alias: null,
				args: null,
				kind: "ScalarField",
				name: "title",
				storageKey: null,
			},
			v0 /*: any*/,
			v1 /*: any*/,
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
			{
				kind: "RequiredField",
				field: {
					alias: null,
					args: null,
					concreteType: "Organization",
					kind: "LinkedField",
					name: "organization",
					plural: false,
					selections: [
						v0 /*: any*/,
						{
							alias: null,
							args: null,
							kind: "ScalarField",
							name: "name",
							storageKey: null,
						},
						v1 /*: any*/,
						{
							alias: null,
							args: null,
							kind: "ScalarField",
							name: "logoUrl",
							storageKey: null,
						},
					],
					storageKey: null,
				},
				action: "THROW",
			},
		],
		type: "Job",
		abstractKey: null,
	};
})();

(node as any).hash = "e0102f557b172be2147a3e6959be7ecf";

export default node;
