/**
 * @generated SignedSource<<56525bafcf7db4bf7c769a134f17a1c3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type UpdateCareerProfileFormFragment$data = {
  readonly __typename: "Profile";
  readonly careerProfile: {
    readonly currentIndustry: string | null | undefined;
    readonly desiredJobTypes: ReadonlyArray<JobType>;
    readonly desiredWorkModes: ReadonlyArray<WorkMode>;
    readonly expectedSalary: number | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "UpdateCareerProfileFormFragment";
};
export type UpdateCareerProfileFormFragment$key = {
  readonly " $data"?: UpdateCareerProfileFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateCareerProfileFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateCareerProfileFormFragment",
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
      "concreteType": "CareerProfile",
      "kind": "LinkedField",
      "name": "careerProfile",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "currentIndustry",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "desiredJobTypes",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "desiredWorkModes",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "expectedSalary",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "4f2719e1a29bcc005e21cd6aeea49a06";

export default node;
