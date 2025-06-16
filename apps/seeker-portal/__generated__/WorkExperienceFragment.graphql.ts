/**
 * @generated SignedSource<<61847fca6038e96953d83e3b2e965f11>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type EmploymentType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "OTHER" | "PART_TIME" | "TEMPORARY" | "VOLUNTEER" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type WorkExperienceFragment$data = {
  readonly __typename: "Profile";
  readonly workExperience: ReadonlyArray<{
    readonly completedAt: any | null | undefined;
    readonly employmentType: EmploymentType | null | undefined;
    readonly organization: string;
    readonly skills: ReadonlyArray<string>;
    readonly startedAt: any;
    readonly title: string;
  }>;
  readonly " $fragmentType": "WorkExperienceFragment";
};
export type WorkExperienceFragment$key = {
  readonly " $data"?: WorkExperienceFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"WorkExperienceFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkExperienceFragment",
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

(node as any).hash = "9c482db037245100e4bd64836e69fc65";

export default node;
