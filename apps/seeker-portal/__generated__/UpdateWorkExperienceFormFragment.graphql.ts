/**
 * @generated SignedSource<<a0c10a44a9d6de1a2a5f93c94a3e06f5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type EmploymentType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "OTHER" | "PART_TIME" | "TEMPORARY" | "VOLUNTEER" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type UpdateWorkExperienceFormFragment$data = {
  readonly __typename: "Profile";
  readonly workExperience: ReadonlyArray<{
    readonly completedAt: any | null | undefined;
    readonly description: string | null | undefined;
    readonly employmentType: EmploymentType | null | undefined;
    readonly organization: string;
    readonly skills: ReadonlyArray<string>;
    readonly startedAt: any;
    readonly title: string;
  }>;
  readonly " $fragmentType": "UpdateWorkExperienceFormFragment";
};
export type UpdateWorkExperienceFormFragment$key = {
  readonly " $data"?: UpdateWorkExperienceFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateWorkExperienceFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateWorkExperienceFormFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "WorkExperience",
      "kind": "LinkedField",
      "name": "workExperience",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "description",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "organization",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "startedAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "completedAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "employmentType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "skills",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "136c7d1172f9273f1988a1e4900bdf02";

export default node;
